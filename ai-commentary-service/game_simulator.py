import pygame
import json
import time
import math
from typing import List, Dict, Tuple, Literal

# Types
CupStatus = Literal['FULL', 'HALF', 'EMPTY']
Team = Literal['RED', 'BLUE']
ActionType = Literal['serve', 'rally', 'hit', 'sink']

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

    def move_ball(self, start_pos, end_pos, duration):
        self.ball_pos = list(start_pos)
        self.ball_target = list(end_pos)
        self.ball_speed = 1.0 / duration
        self.ball_visible = True

    def update_ball_position(self, dt):
        if not self.ball_visible:
            return

        dx = self.ball_target[0] - self.ball_pos[0]
        dy = self.ball_target[1] - self.ball_pos[1]
        distance = math.sqrt(dx * dx + dy * dy)
        
        if distance < 5:
            self.ball_visible = False
            return
        
        move_distance = self.ball_speed * dt
        if move_distance > distance:
            move_distance = distance
        
        ratio = move_distance / distance
        self.ball_pos[0] += dx * ratio
        self.ball_pos[1] += dy * ratio

    def process_action(self, action: Dict):
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
            # Ball moves between players
            start_pos = self.player_positions[player]
            # Find next player in sequence
            next_player = 'C' if player == 'A' else 'D' if player == 'B' else 'A' if player == 'C' else 'B'
            end_pos = self.player_positions[next_player]
            self.move_ball(start_pos, end_pos, 0.5)
            
        elif action_type == 'hit':
            hit_team = 'BLUE' if player in self.TEAM_1_PLAYERS else 'RED'
            hit_cup = self.update_random_cup(hit_team, 'HALF')
            if hit_cup:
                self.move_ball(self.player_positions[player], (hit_cup.x, hit_cup.y), 0.5)
                
        elif action_type == 'sink':
            sink_team = 'BLUE' if player in self.TEAM_1_PLAYERS else 'RED'
            sink_cup = self.update_random_cup(sink_team, 'EMPTY')
            if sink_cup:
                self.move_ball(self.player_positions[player], (sink_cup.x, sink_cup.y), 0.5)

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
        
        # Draw ball
        if self.ball_visible:
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