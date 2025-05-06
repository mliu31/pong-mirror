import pygame
import json
import time
import math
import random
from typing import List, Dict, Tuple, Literal

# Types
CupStatus = Literal['FULL', 'HALF', 'EMPTY']
Team = Literal['RED', 'BLUE']
ActionType = Literal['serve', 'rally', 'hit', 'sink']

class CommentaryManager:
    def __init__(self):
        self.commentary_history = []
        self.last_commentary_time = 0
        self.commentary_cooldown = 1.0  # Reduced cooldown for more frequent commentary
        
        # Predefined commentary templates
        self.commentary_templates = {
            'hit': [
                "Player {player} hits a cup! Team {team} is on fire!",
                "What a shot by {player}! That cup is half full now!",
                "{player} with a solid hit! Team {team} is making their move!",
                "Nice aim by {player}! That cup is looking half empty!",
                "Team {team}'s {player} with a precise hit!"
            ],
            'sink': [
                "INCREDIBLE! {player} sinks it! Team {team} is dominating!",
                "BOOM! {player} with the perfect shot!",
                "Team {team}'s {player} just made it look easy!",
                "That's a SINK! {player} is on fire!",
                "Team {team} is unstoppable! {player} with another perfect shot!"
            ],
            'rally': [
                "The ball is flying back and forth!",
                "What a rally between the teams!",
                "The tension is building in this rally!",
                "Both teams showing great skill!",
                "This rally is getting intense!"
            ],
            'serve': [
                "Team {team} starting strong with {player}'s serve!",
                "{player} takes the first shot!",
                "Here we go! {player} with the opening serve!",
                "Team {team} begins the game with {player}'s serve!",
                "The game is on! {player} with the first throw!"
            ]
        }
        
        # Special situation templates
        self.special_templates = {
            'comeback': [
                "Team {team} is making an incredible comeback!",
                "Watch out! Team {team} is catching up!",
                "The momentum is shifting in Team {team}'s favor!"
            ],
            'domination': [
                "Team {team} is absolutely dominating!",
                "This is a masterclass by Team {team}!",
                "Team {team} is unstoppable right now!"
            ],
            'close_game': [
                "This is anyone's game!",
                "The tension is palpable!",
                "What a close match we have here!"
            ]
        }
        
    def generate_commentary(self, action: Dict, game_state: Dict) -> str:
        """Generate commentary based on the current action and game state"""
        current_time = time.time()
        if current_time - self.last_commentary_time < self.commentary_cooldown:
            return None
            
        self.last_commentary_time = current_time
        
        action_type = action['type']
        player = action['player']
        team = "Team 1" if player in ['A', 'B'] else "Team 2"
        
        # Check for special situations
        special_commentary = self._check_special_situations(game_state, team)
        if special_commentary and random.random() < 0.3:  # 30% chance to use special commentary
            return special_commentary
        
        # Get template for the current action
        templates = self.commentary_templates.get(action_type, [])
        if not templates:
            return None
            
        # Select and format a random template
        template = random.choice(templates)
        commentary = template.format(player=player, team=team)
        
        # Add to history
        self.commentary_history.append(commentary)
        if len(self.commentary_history) > 5:
            self.commentary_history.pop(0)
            
        return commentary
    
    def _check_special_situations(self, game_state: Dict, current_team: str) -> str:
        """Check for special game situations and return appropriate commentary"""
        red_empty = game_state['red_empty']
        blue_empty = game_state['blue_empty']
        
        # Check for domination
        if current_team == "Team 1" and red_empty >= 3 and red_empty > blue_empty:
            return random.choice(self.special_templates['domination']).format(team=current_team)
        elif current_team == "Team 2" and blue_empty >= 3 and blue_empty > red_empty:
            return random.choice(self.special_templates['domination']).format(team=current_team)
            
        # Check for comeback
        if current_team == "Team 1" and red_empty > blue_empty and red_empty >= 2:
            return random.choice(self.special_templates['comeback']).format(team=current_team)
        elif current_team == "Team 2" and blue_empty > red_empty and blue_empty >= 2:
            return random.choice(self.special_templates['comeback']).format(team=current_team)
            
        # Check for close game
        if abs(red_empty - blue_empty) <= 1:
            return random.choice(self.special_templates['close_game'])
            
        return None

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
    def __init__(self, game_log_path: str):
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
        
        # Initialize commentary manager without API key
        self.commentary_manager = CommentaryManager()
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
        
        # Only generate commentary for significant actions
        if action['type'] in ['hit', 'sink']:
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
        # Draw table halves
        pygame.draw.rect(self.screen, self.TABLE_COLOR_1, (0, 0, self.width//2, self.height))
        pygame.draw.rect(self.screen, self.TABLE_COLOR_2, (self.width//2, 0, self.width//2, self.height))
        pygame.draw.rect(self.screen, self.BORDER_COLOR, (0, 0, self.width, self.height), 10)
        
        # Draw center line
        pygame.draw.line(self.screen, self.BORDER_COLOR, (self.width//2, 0), (self.width//2, self.height), 5)
        
        # Draw cups
        for cup in self.red_cups + self.blue_cups:
            cup.draw(self.screen)
        
        # Draw players
        for player, pos in self.player_positions.items():
            pygame.draw.circle(self.screen, self.PLAYER_COLORS[player], pos, 15)
            text = self.small_font.render(player, True, (255, 255, 255))
            self.screen.blit(text, (pos[0] - 5, pos[1] - 10))
        
        # Draw the ball trail with gradient
        for i, (trail_x, trail_y) in enumerate(self.ball_trail):
            # Calculate gradient color based on position in trail
            alpha = int(255 * (i / len(self.ball_trail)))
            size = int(8 * (i / len(self.ball_trail)))
            trail_surface = pygame.Surface((20, 20), pygame.SRCALPHA)
            pygame.draw.circle(trail_surface, (255, 255, 255, alpha), (10, 10), size)
            self.screen.blit(trail_surface, (trail_x - 10, trail_y - 10))

        # Draw the ball with enhanced glow
        if self.ball_visible:
            # Draw multiple glow layers for better effect
            for radius, alpha in [(20, 50), (15, 100), (10, 150)]:
                glow_surface = pygame.Surface((radius*2, radius*2), pygame.SRCALPHA)
                pygame.draw.circle(glow_surface, (255, 255, 255, alpha), (radius, radius), radius)
                self.screen.blit(glow_surface, (self.ball_pos[0] - radius, self.ball_pos[1] - radius))
            
            # Draw the ball
            pygame.draw.circle(self.screen, (255, 255, 255), 
                             (int(self.ball_pos[0]), int(self.ball_pos[1])), 8)
        
        # Draw cup status counts
        red_full = sum(1 for cup in self.red_cups if cup.status == 'FULL')
        red_half = sum(1 for cup in self.red_cups if cup.status == 'HALF')
        red_empty = sum(1 for cup in self.red_cups if cup.status == 'EMPTY')
        blue_full = sum(1 for cup in self.blue_cups if cup.status == 'FULL')
        blue_half = sum(1 for cup in self.blue_cups if cup.status == 'HALF')
        blue_empty = sum(1 for cup in self.blue_cups if cup.status == 'EMPTY')
        
        status_text = [
            f"Team 1 (A,B) - Full: {red_full} Half: {red_half} Empty: {red_empty}",
            f"Team 2 (C,D) - Full: {blue_full} Half: {blue_half} Empty: {blue_empty}"
        ]
        
        for i, text in enumerate(status_text):
            text_surface = self.font.render(text, True, (255, 255, 255))
            self.screen.blit(text_surface, (10, 10 + i * 30))
        
        # Draw current action info
        if self.current_action_index < len(self.game_log):
            action = self.game_log[self.current_action_index]
            action_text = f"Time: {action['timestamp']}s - {action['type']} by Player {action['player']}"
            text_surface = self.font.render(action_text, True, (255, 255, 255))
            self.screen.blit(text_surface, (10, self.height - 40))
        
        # Draw controls info
        controls_text = f"Speed: {self.playback_speed}x - {'Paused' if self.is_paused else 'Playing'}"
        text_surface = self.font.render(controls_text, True, (255, 255, 255))
        self.screen.blit(text_surface, (10, self.height - 80))

        # Draw current commentary if it exists and hasn't expired
        if self.current_commentary and time.time() < self.commentary_fade_time:
            # Calculate fade effect
            time_left = self.commentary_fade_time - time.time()
            alpha = min(255, int(255 * (time_left / 0.5)))  # Fade out in last 0.5 seconds
            
            # Create a surface for the commentary with transparency
            commentary_surface = pygame.Surface((self.width - 40, 60), pygame.SRCALPHA)
            commentary_surface.fill((0, 0, 0, 128))  # Semi-transparent black background
            
            # Render the commentary text with word wrapping
            words = self.current_commentary.split()
            lines = []
            current_line = []
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                if self.font.size(test_line)[0] < self.width - 80:  # Leave margin
                    current_line.append(word)
                else:
                    lines.append(' '.join(current_line))
                    current_line = [word]
            if current_line:
                lines.append(' '.join(current_line))
            
            # Draw each line
            for i, line in enumerate(lines):
                text_surface = self.font.render(line, True, (255, 255, 255))
                text_rect = text_surface.get_rect(center=(self.width//2, 20 + i * 25))
                commentary_surface.blit(text_surface, text_rect)
            
            # Draw the commentary surface on the main screen
            self.screen.blit(commentary_surface, (20, self.height - 100))

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
    simulator = PongSimulator("test_game_logs/pong_short (1).json")
    simulator.run()