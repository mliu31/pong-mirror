import pygame
import json
import time
import math
import random
import requests
from typing import List, Dict, Tuple, Literal

# API Configuration
API_CONFIG = {
    "endpoint": "https://api.mistral.ai/v1/chat/completions",
    "api_key": "YOUR_MISTRAL_API_KEY"  # Replace with your actual Mistral API key
}

# Types
CupStatus = Literal['FULL', 'HALF', 'EMPTY']
Team = Literal['RED', 'BLUE']
ActionType = Literal['serve', 'rally', 'hit', 'sink']

class CommentaryManager:
    def __init__(self, api_endpoint: str, api_key: str):
        self.api_endpoint = api_endpoint
        self.api_key = api_key
        self.commentary_history = []
        self.last_commentary_time = 0
        self.commentary_cooldown = 1.0
        self.current_commentator = 0  # 0 for John, 1 for Jane
        self.commentator_personalities = {
            0: "John",  # Professional and analytical commentator
            1: "Jane"   # Energetic and humorous commentator
        }
        self.commentator_styles = {
            "John": {
                "style": "professional and analytical",
                "catchphrases": [
                    "Let's analyze this play...",
                    "From a strategic perspective...",
                    "The key factor here is...",
                    "Looking at the statistics..."
                ]
            },
            "Jane": {
                "style": "energetic and humorous",
                "catchphrases": [
                    "OH MY GOODNESS!",
                    "This is absolutely INSANE!",
                    "I can't believe what we're seeing!",
                    "The crowd is going WILD!"
                ]
            }
        }
        
    def generate_commentary(self, action: Dict, game_state: Dict) -> str:
        """Generate commentary using the Mistral model with two commentators"""
        current_time = time.time()
        if current_time - self.last_commentary_time < self.commentary_cooldown:
            return None
            
        self.last_commentary_time = current_time
        
        # Prepare the prompt
        prompt = self._create_prompt(action, game_state)
        
        try:
            # Make request to Mistral API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "mistral-7b",
                "messages": [
                    {
                        "role": "system",
                        "content": """You are an exciting beer pong commentator with a unique personality. Your commentary should be:
1. Energetic and engaging - use exclamations and enthusiasm!
2. Include specific game context and strategy - mention cup positions and team dynamics
3. Reference previous plays and momentum - build a narrative
4. Use sports-like excitement and enthusiasm - like a professional sports commentator
5. Keep responses brief but impactful (max 2 sentences)
6. Include player names and team dynamics
7. Add personality - use catchphrases and unique expressions
8. Create tension and excitement - especially during important moments
9. Use beer pong specific terminology and references
10. React to the game situation with appropriate emotion"""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.95,  # Increased for more creative responses
                "max_tokens": 150,
                "top_p": 0.98,
                "frequency_penalty": 0.5,  # Increased to encourage diverse responses
                "presence_penalty": 0.5    # Increased to encourage diverse responses
            }
            
            response = requests.post(
                self.api_endpoint,
                headers=headers,
                json=data,
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                commentary = result['choices'][0]['message']['content'].strip()
                
                # Add to history
                self.commentary_history.append(commentary)
                if len(self.commentary_history) > 5:
                    self.commentary_history.pop(0)
                
                # Switch commentators for next time
                self.current_commentator = 1 - self.current_commentator
                    
                return commentary
            else:
                print(f"API Error: {response.status_code} - {response.text}")
                # Return a more interesting fallback commentary
                return self._generate_fallback_commentary(action, game_state)
                
        except Exception as e:
            print(f"Error generating commentary: {e}")
            return self._generate_fallback_commentary(action, game_state)
    
    def _generate_fallback_commentary(self, action: Dict, game_state: Dict) -> str:
        """Generate fallback commentary when API fails"""
        action_type = action['type']
        player = action['player']
        team = "Red Dragons" if player in ['A', 'B'] else "Blue Warriors"
        
        # Get cup status for context
        red_empty = game_state['red_empty']
        blue_empty = game_state['blue_empty']
        
        # Generate context-aware fallback commentary
        if action_type == 'sink':
            return f"INCREDIBLE! Player {player} from {team} just SANK that cup! The crowd is going wild!"
        elif action_type == 'hit':
            return f"Player {player} from {team} hits the rim! That's going to be a tough one to recover!"
        elif action_type == 'serve':
            return f"Here comes {player} from {team} with a powerful serve! Let's see what they've got!"
        else:  # rally
            return f"The ball is flying between teams! {player} from {team} keeping the rally alive!"
    
    def _create_prompt(self, action: Dict, game_state: Dict) -> str:
        """Create a prompt for the Mistral model with two commentators"""
        action_type = action['type']
        player = action['player']
        timestamp = action['timestamp']
        
        # Get team information
        team = "Team 1" if player in ['A', 'B'] else "Team 2"
        team_name = "Red Dragons" if team == "Team 1" else "Blue Warriors"
        
        # Get cup status information
        red_full = game_state['red_full']
        red_half = game_state['red_half']
        red_empty = game_state['red_empty']
        blue_full = game_state['blue_full']
        blue_half = game_state['blue_half']
        blue_empty = game_state['blue_empty']
        
        # Calculate team scores and momentum
        red_score = red_empty * 2 + red_half
        blue_score = blue_empty * 2 + blue_half
        red_momentum = "dominating" if red_score > blue_score + 4 else "struggling" if red_score < blue_score - 4 else "holding steady"
        blue_momentum = "dominating" if blue_score > red_score + 4 else "struggling" if blue_score < red_score - 4 else "holding steady"
        
        # Calculate game progress and tension
        total_cups = red_full + red_half + red_empty + blue_full + blue_half + blue_empty
        game_progress = (red_empty + blue_empty) / total_cups * 100
        game_tension = "high" if abs(red_score - blue_score) <= 2 else "moderate" if abs(red_score - blue_score) <= 4 else "low"
        
        # Get current commentator
        commentator = self.commentator_personalities[self.current_commentator]
        other_commentator = self.commentator_personalities[1 - self.current_commentator]
        commentator_style = self.commentator_styles[commentator]
        other_style = self.commentator_styles[other_commentator]
        
        # Format commentary history
        commentary_history = "\n".join([f"- {comment}" for comment in self.commentary_history[-3:]]) if self.commentary_history else "No previous commentary"
        
        # Create a more detailed prompt for exciting commentary
        prompt = f"""You are {commentator}, a beer pong commentator. Your co-commentator is {other_commentator}.
Your style is {commentator_style['style']} - use phrases like: {', '.join(commentator_style['catchphrases'])}
{other_commentator}'s style is {other_style['style']} - they use phrases like: {', '.join(other_style['catchphrases'])}

GAME OVERVIEW:
- Game Progress: {game_progress:.1f}% complete
- Time Elapsed: {timestamp:.1f} seconds
- Game Tension: {game_tension}

TEAM STATUS:
Red Dragons (Players A,B):
- Full Cups: {red_full}
- Half Cups: {red_half}
- Empty Cups: {red_empty}
- Score: {red_score}
- Momentum: {red_momentum}
- Key Player: {'A' if red_score > blue_score else 'B'}

Blue Warriors (Players C,D):
- Full Cups: {blue_full}
- Half Cups: {blue_half}
- Empty Cups: {blue_empty}
- Score: {blue_score}
- Momentum: {blue_momentum}
- Key Player: {'C' if blue_score > red_score else 'D'}

RECENT COMMENTARY:
{commentary_history}

CURRENT ACTION:
Player {player} from {team_name} performs a {action_type}

Generate an exciting, context-aware commentary as {commentator}. Consider:
1. The overall game progress and momentum - is this a crucial moment?
2. The significance of this action in the current game state - how does it affect the game?
3. How this play might affect the game's outcome - is it a game-changer?
4. Reference previous commentary to create a narrative flow - build the story
5. Keep it brief but impactful (max 2 sentences)
6. Use beer pong specific terminology and expressions
7. Add your unique personality and style - use your catchphrases!
8. Create excitement and tension appropriate to the moment"""
        return prompt

class Cup:
    def __init__(self, x: float, y: float, status: CupStatus = 'FULL'):
        self.x = x
        self.y = y
        self.status = status
        self.radius = 20

    def draw(self, screen: pygame.Surface):
        if self.status == 'FULL':
            color = (255, 255, 255)
            alpha = 255
        elif self.status == 'HALF':
            color = (255, 255, 255)
            alpha = 128
        else:  # EMPTY
            color = (200, 200, 200)
            alpha = 50

        # Create a surface for the cup with transparency
        cup_surface = pygame.Surface((self.radius * 2, self.radius * 2), pygame.SRCALPHA)
        
        # Draw the cup
        pygame.draw.circle(cup_surface, (*color, alpha), (self.radius, self.radius), self.radius)
        pygame.draw.circle(cup_surface, (0, 0, 0, 255), (self.radius, self.radius), self.radius, 2)
        
        # Draw the cup opening
        pygame.draw.circle(cup_surface, (0, 0, 0, 255), (self.radius, self.radius), self.radius - 5, 2)
        
        screen.blit(cup_surface, (self.x - self.radius, self.y - self.radius))

class PongSimulator:
    def __init__(self, game_log_path: str, api_endpoint: str, api_key: str):
        # Initialize Pygame
        pygame.init()
        
        # Load game log
        with open(game_log_path, 'r') as f:
            self.game_log = json.load(f)
        
        # Screen setup
        self.width = 1200
        self.height = 800
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption("Beer Pong Simulator")
        
        # Game state
        self.current_action_index = 0
        self.is_paused = True
        self.playback_speed = 1.0
        self.last_action_time = 0
        
        # Ball state
        self.ball_pos = [0, 0]
        self.ball_target = [0, 0]
        self.ball_speed = 0
        self.ball_visible = False
        self.ball_trail = []
        self.ball_bounce = 0
        self.ball_arc_height = 0  # Maximum height of the ball's arc
        self.ball_progress = 0    # Progress along the path (0 to 1)
        self.ball_path = []       # List of points along the ball's path
        
        # Player positions
        self.player_positions = {
            'A': (100, 200),  # Team 1 left
            'B': (100, 400),  # Team 1 right
            'C': (1100, 200), # Team 2 left
            'D': (1100, 400)  # Team 2 right
        }
        
        # Initialize cups
        self.red_cups = self.initialize_cups('RED')
        self.blue_cups = self.initialize_cups('BLUE')
        
        # Team definitions
        self.TEAM_1_PLAYERS = ['A', 'B']
        self.TEAM_2_PLAYERS = ['C', 'D']
        
        # Colors
        self.TABLE_COLOR_1 = (139, 69, 19)  # Brown
        self.TABLE_COLOR_2 = (101, 67, 33)  # Darker brown
        self.BORDER_COLOR = (0, 0, 0)       # Black
        self.PLAYER_COLORS = {
            'A': (255, 0, 0),    # Red
            'B': (255, 100, 100),# Light Red
            'C': (0, 0, 255),    # Blue
            'D': (100, 100, 255) # Light Blue
        }
        
        # Font
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        
        # Initialize commentary manager with API endpoint and key
        self.commentary_manager = CommentaryManager(api_endpoint, api_key)
        self.current_commentary = None
        self.commentary_fade_time = 0
        self.commentary_duration = 2.0

    def initialize_cups(self, team: Team) -> List[Cup]:
        cups = []
        # Define the exact positions for each cup in the tree formation
        # Each tuple is (x_offset, y_offset) relative to the base position
        if team == 'RED':
            base_x = 300  # Left side base position
            base_y = 300  # Vertical center
            # Left tree formation (pointing right): 1,4,3,2,1
            positions = [
                # Left tip (1 cup)
                (-160, 0),  # Left x
                # Second row (4 cups)
                (-80, -120),  # Top x
                (-80, -40),   # Top middle x
                (-80, 40),    # Bottom middle x
                (-80, 120),   # Bottom x
                # Third row (3 cups)
                (0, -80),     # Top x
                (0, 0),       # Middle x
                (0, 80),      # Bottom x
                # Fourth row (2 cups)
                (80, -40),    # Top x
                (80, 40),     # Bottom x
                # Right tip (1 cup)
                (160, 0),     # Right x
            ]
        else:
            base_x = 900  # Right side base position
            base_y = 300  # Vertical center
            # Right tree formation (pointing left): 1,2,3,4,1
            positions = [
                # Right tip (1 cup)
                (-160, 0),  # Right x
                # Second row (2 cups)
                (-80, -40),  # Top x
                (-80, 40),   # Bottom x
                # Third row (3 cups)
                (0, -80),   # Top x
                (0, 0),     # Middle x
                (0, 80),    # Bottom x
                # Fourth row (4 cups)
                (80, -120),  # Top x
                (80, -40),   # Top middle x
                (80, 40),    # Bottom middle x
                (80, 120),   # Bottom x
                # Left tip (1 cup)
                (160, 0),    # Left x
            ]
        
        # Create cups at each position
        for x_offset, y_offset in positions:
            x = base_x + x_offset
            y = base_y + y_offset
            cups.append(Cup(x, y))
        
        return cups

    def update_random_cup(self, team: Team, status: CupStatus):
        cups = self.red_cups if team == 'RED' else self.blue_cups
        valid_cups = [cup for cup in cups if 
                     (status == 'HALF' and cup.status == 'FULL') or 
                     (status == 'EMPTY' and cup.status != 'EMPTY')]
        
        if valid_cups:
            import random
            cup = random.choice(valid_cups)
            cup.status = status
            return cup
        return None

    def calculate_arc_path(self, start_pos, end_pos, height=100, points=20):
        """Calculate a curved path for the ball to follow"""
        path = []
        for i in range(points + 1):
            t = i / points
            # Quadratic bezier curve for the arc
            x = start_pos[0] + (end_pos[0] - start_pos[0]) * t
            y = start_pos[1] + (end_pos[1] - start_pos[1]) * t
            # Add arc height (parabolic curve)
            arc = height * math.sin(math.pi * t)
            path.append((x, y - arc))
        return path

    def move_ball(self, start_pos, end_pos, duration):
        self.ball_pos = list(start_pos)
        self.ball_target = list(end_pos)
        self.ball_speed = 1.0 / duration
        self.ball_visible = True
        self.ball_trail = []
        self.ball_progress = 0
        
        # Calculate the arc height based on distance
        distance = math.sqrt((end_pos[0] - start_pos[0])**2 + (end_pos[1] - start_pos[1])**2)
        self.ball_arc_height = min(distance * 0.3, 150)  # Arc height proportional to distance
        
        # Calculate the ball's path
        self.ball_path = self.calculate_arc_path(start_pos, end_pos, self.ball_arc_height)

    def update_ball_position(self, dt):
        if not self.ball_visible:
            return

        # Update progress along the path
        self.ball_progress += self.ball_speed * dt
        if self.ball_progress >= 1.0:
            self.ball_visible = False
            return

        # Get current position along the path
        path_index = int(self.ball_progress * (len(self.ball_path) - 1))
        if path_index < len(self.ball_path):
            self.ball_pos = list(self.ball_path[path_index])
            
            # Add current position to trail
            self.ball_trail.append((self.ball_pos[0], self.ball_pos[1]))
            if len(self.ball_trail) > 15:  # Increased trail length
                self.ball_trail.pop(0)

    def process_action(self, action: Dict):
        # Get current game state for commentary
        game_state = {
            'red_full': sum(1 for cup in self.red_cups if cup.status == 'FULL'),
            'red_half': sum(1 for cup in self.red_cups if cup.status == 'HALF'),
            'red_empty': sum(1 for cup in self.red_cups if cup.status == 'EMPTY'),
            'blue_full': sum(1 for cup in self.blue_cups if cup.status == 'FULL'),
            'blue_half': sum(1 for cup in self.blue_cups if cup.status == 'HALF'),
            'blue_empty': sum(1 for cup in self.blue_cups if cup.status == 'EMPTY')
        }
        
        # Generate commentary for all actions
        commentary = self.commentary_manager.generate_commentary(action, game_state)
        if commentary:
            self.current_commentary = commentary
            self.commentary_fade_time = time.time() + self.commentary_duration
        
        # Process the action as before
        action_type = action['type']
        player = action['player']
        
        if action_type == 'serve':
            # Ball starts from serving player
            start_pos = self.player_positions[player]
            # Ball moves to random cup on opposite side
            target_team = 'BLUE' if player in self.TEAM_1_PLAYERS else 'RED'
            target_cups = self.blue_cups if target_team == 'BLUE' else self.red_cups
            target_cup = target_cups[0]  # Start with first cup
            self.move_ball(start_pos, (target_cup.x, target_cup.y), 1.0)
            
        elif action_type == 'rally':
            # Ball moves between players with a high arc
            start_pos = self.player_positions[player]
            next_player = 'C' if player == 'A' else 'D' if player == 'B' else 'A' if player == 'C' else 'B'
            end_pos = self.player_positions[next_player]
            self.move_ball(start_pos, end_pos, 0.8)  # Slower for rally
            
        elif action_type == 'hit':
            hit_team = 'BLUE' if player in self.TEAM_1_PLAYERS else 'RED'
            hit_cup = self.update_random_cup(hit_team, 'HALF')
            if hit_cup:
                self.move_ball(self.player_positions[player], (hit_cup.x, hit_cup.y), 0.6)
                
        elif action_type == 'sink':
            sink_team = 'BLUE' if player in self.TEAM_1_PLAYERS else 'RED'
            sink_cup = self.update_random_cup(sink_team, 'EMPTY')
            if sink_cup:
                self.move_ball(self.player_positions[player], (sink_cup.x, sink_cup.y), 0.6)

    def draw(self):
        """Draw the current game state"""
        # Clear screen
        self.screen.fill((0, 0, 0))
        
        # Draw table
        pygame.draw.rect(self.screen, self.TABLE_COLOR_1, (50, 50, self.width - 100, self.height - 100))
        pygame.draw.rect(self.screen, self.TABLE_COLOR_2, (60, 60, self.width - 120, self.height - 120))
        pygame.draw.rect(self.screen, self.BORDER_COLOR, (50, 50, self.width - 100, self.height - 100), 2)
        
        # Draw cups
        for cup in self.red_cups:
            cup.draw(self.screen)
        for cup in self.blue_cups:
            cup.draw(self.screen)
        
        # Draw players
        for player, pos in self.player_positions.items():
            pygame.draw.circle(self.screen, self.PLAYER_COLORS[player], pos, 15)
            text = self.small_font.render(player, True, (0, 0, 0))
            text_rect = text.get_rect(center=pos)
            self.screen.blit(text, text_rect)
        
        # Draw ball trail
        if self.ball_trail:
            for i, pos in enumerate(self.ball_trail):
                alpha = int(255 * (i / len(self.ball_trail)))
                trail_surface = pygame.Surface((10, 10), pygame.SRCALPHA)
                pygame.draw.circle(trail_surface, (255, 255, 255, alpha), (5, 5), 5)
                self.screen.blit(trail_surface, (pos[0] - 5, pos[1] - 5))
        
        # Draw ball
        if self.ball_visible:
            pygame.draw.circle(self.screen, (255, 255, 255), (int(self.ball_pos[0]), int(self.ball_pos[1])), 5)
        
        # Draw game state (cup counts)
        red_full = sum(1 for cup in self.red_cups if cup.status == 'FULL')
        red_half = sum(1 for cup in self.red_cups if cup.status == 'HALF')
        red_empty = sum(1 for cup in self.red_cups if cup.status == 'EMPTY')
        blue_full = sum(1 for cup in self.blue_cups if cup.status == 'FULL')
        blue_half = sum(1 for cup in self.blue_cups if cup.status == 'HALF')
        blue_empty = sum(1 for cup in self.blue_cups if cup.status == 'EMPTY')
        
        # Create game state box
        state_box_height = 100
        state_box_surface = pygame.Surface((200, state_box_height), pygame.SRCALPHA)
        pygame.draw.rect(state_box_surface, (0, 0, 0, 128), (0, 0, 200, state_box_height))
        
        # Draw team 1 (red) state
        team1_text = self.small_font.render("Team 1 (Red):", True, (255, 0, 0))
        state_box_surface.blit(team1_text, (10, 5))
        cups1_text = self.small_font.render(f"Full: {red_full}  Half: {red_half}  Empty: {red_empty}", True, (255, 255, 255))
        state_box_surface.blit(cups1_text, (10, 25))
        
        # Draw team 2 (blue) state
        team2_text = self.small_font.render("Team 2 (Blue):", True, (0, 0, 255))
        state_box_surface.blit(team2_text, (10, 55))
        cups2_text = self.small_font.render(f"Full: {blue_full}  Half: {blue_half}  Empty: {blue_empty}", True, (255, 255, 255))
        state_box_surface.blit(cups2_text, (10, 75))
        
        # Draw game state box in top-right corner
        self.screen.blit(state_box_surface, (self.width - 220, 20))
        
        # Draw commentary
        if self.current_commentary and time.time() < self.commentary_fade_time:
            # Calculate fade alpha
            fade_time = self.commentary_fade_time - time.time()
            alpha = min(255, int(fade_time * 255 / 0.5)) if fade_time < 0.5 else 255
            
            # Create commentary box
            box_height = 100  # Increased height for multiple lines
            box_surface = pygame.Surface((self.width - 100, box_height), pygame.SRCALPHA)
            pygame.draw.rect(box_surface, (0, 0, 0, 128), (0, 0, self.width - 100, box_height))
            
            # Get current commentator
            commentator = self.commentary_manager.commentator_personalities[self.commentary_manager.current_commentator]
            
            # Render commentator name
            name_text = self.small_font.render(f"{commentator}:", True, (255, 255, 0))  # Yellow color for names
            name_rect = name_text.get_rect(left=10, top=10)
            box_surface.blit(name_text, name_rect)
            
            # Render commentary text with word wrapping
            words = self.current_commentary.split()
            lines = []
            current_line = []
            max_width = self.width - 120  # Leave some margin
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                test_surface = self.font.render(test_line, True, (255, 255, 255))
                if test_surface.get_width() <= max_width:
                    current_line.append(word)
                else:
                    lines.append(' '.join(current_line))
                    current_line = [word]
            if current_line:
                lines.append(' '.join(current_line))
            
            # Render each line
            for i, line in enumerate(lines):
                text = self.font.render(line, True, (255, 255, 255))
                text_rect = text.get_rect(left=10, top=35 + i * 25)  # Position below the name with spacing
                box_surface.blit(text, text_rect)
            
            # Draw the box at the bottom of the screen
            self.screen.blit(box_surface, (50, self.height - box_height - 50))
        
        # Draw controls help
        controls = [
            "Space: Pause/Resume",
            "Up/Down: Speed",
            "Left/Right: Step",
            "Q: Quit"
        ]
        
        for i, control in enumerate(controls):
            text = self.small_font.render(control, True, (255, 255, 255))
            self.screen.blit(text, (10, 10 + i * 20))

    def run(self):
        running = True
        clock = pygame.time.Clock()
        last_time = time.time()
        
        while running:
            current_time = time.time()
            dt = current_time - last_time
            last_time = current_time
            
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        self.is_paused = not self.is_paused
                    elif event.key == pygame.K_UP:
                        self.playback_speed = min(3.0, self.playback_speed + 0.5)
                    elif event.key == pygame.K_DOWN:
                        self.playback_speed = max(0.5, self.playback_speed - 0.5)
                    elif event.key == pygame.K_RIGHT:
                        self.current_action_index = min(len(self.game_log) - 1, 
                                                      self.current_action_index + 1)
                    elif event.key == pygame.K_LEFT:
                        self.current_action_index = max(0, self.current_action_index - 1)
            
            # Update ball position
            self.update_ball_position(dt)
            
            # Process actions
            if not self.is_paused and self.current_action_index < len(self.game_log):
                action = self.game_log[self.current_action_index]
                next_action = self.game_log[self.current_action_index + 1] if self.current_action_index + 1 < len(self.game_log) else None
                
                if next_action:
                    delay = (next_action['timestamp'] - action['timestamp']) / self.playback_speed
                    if current_time - self.last_action_time >= delay:
                        self.process_action(action)
                        self.current_action_index += 1
                        self.last_action_time = current_time
                else:
                    self.process_action(action)
                    self.current_action_index += 1
            
            # Draw everything
            self.draw()
            pygame.display.flip()
            clock.tick(60)
        
        pygame.quit()

if __name__ == "__main__":
    simulator = PongSimulator("test_game_logs/new_pong_long.json", API_CONFIG["endpoint"], API_CONFIG["api_key"])
    simulator.run()