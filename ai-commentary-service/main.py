"""
Beer Pong Commentary API
A FastAPI backend service for generating AI-powered commentary for beer pong games.
"""

import json
import os
import time
import uuid
from typing import Dict, List, Optional, Literal
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the CommentaryManager from the original game_simulator
from game_simulator import CommentaryManager

# API Configuration
API_CONFIG = {
    "endpoint": os.environ.get("MISTRAL_API_ENDPOINT", "https://api.mistral.ai/v1/chat/completions"),
    "api_key": os.environ.get("MISTRAL_API_KEY", "YOUR_MISTRAL_API_KEY")
}

app = FastAPI(
    title="Beer Pong Commentary API",
    description="API for generating AI commentary for beer pong games using Mistral 7B",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React Native and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Type definitions
CupStatus = Literal['FULL', 'HALF', 'EMPTY']
Team = Literal['RED', 'BLUE']
ActionType = Literal['serve', 'rally', 'hit', 'sink']

# Pydantic models
class Cup(BaseModel):
    x: float
    y: float
    status: CupStatus

class Action(BaseModel):
    timestamp: float 
    type: ActionType
    player: str  # 'A', 'B', 'C', or 'D'

class GameState(BaseModel):
    red_full: int
    red_half: int
    red_empty: int
    blue_full: int
    blue_half: int
    blue_empty: int

class CommentaryRequest(BaseModel):
    action: Action
    game_state: GameState

class Game(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    actions: List[Action] = []
    commentaries: List[Dict] = []
    current_state: Optional[GameState] = None

class CommentaryResponse(BaseModel):
    commentary: Optional[str]
    commentator: Optional[str]
    timestamp: float

class GameResponse(BaseModel):
    game: Game
    message: str

# In-memory storage (in production, use a proper database)
games_db = {}

# Initialize the CommentaryManager
commentary_manager = CommentaryManager(API_CONFIG["endpoint"], API_CONFIG["api_key"])

# Helper functions
def get_game(game_id: str) -> Game:
    if game_id not in games_db:
        raise HTTPException(status_code=404, detail=f"Game with ID {game_id} not found")
    return games_db[game_id]

def update_game_state(game: Game, action: Action):
    """Update the game state based on the action"""
    current_state = game.current_state
    if not current_state:
        current_state = GameState(
            red_full=10, red_half=0, red_empty=0,
            blue_full=10, blue_half=0, blue_empty=0
        )
        game.current_state = current_state
    
    # Update cup counts based on the action
    if action.type == "hit":
        if action.player in ['A', 'B']:  # Team 1 players hit Team 2's cups
            if current_state.blue_full > 0:
                current_state.blue_full -= 1
                current_state.blue_half += 1
        else:  # Team 2 players hit Team 1's cups
            if current_state.red_full > 0:
                current_state.red_full -= 1
                current_state.red_half += 1
    
    elif action.type == "sink":
        if action.player in ['A', 'B']:  # Team 1 players sink Team 2's cups
            if current_state.blue_half > 0:
                current_state.blue_half -= 1
                current_state.blue_empty += 1
            elif current_state.blue_full > 0:
                current_state.blue_full -= 1
                current_state.blue_empty += 1
        else:  # Team 2 players sink Team 1's cups
            if current_state.red_half > 0:
                current_state.red_half -= 1
                current_state.red_empty += 1
            elif current_state.red_full > 0:
                current_state.red_full -= 1
                current_state.red_empty += 1

async def generate_and_save_commentary(game_id: str, action: Dict, game_state: Dict):
    """Generate commentary for an action and save it to the game"""
    commentary = commentary_manager.generate_commentary(action, game_state)
    if commentary and game_id in games_db:
        commentator = commentary_manager.commentator_personalities[commentary_manager.current_commentator]
        games_db[game_id].commentaries.append({
            "action": action,
            "commentary": commentary,
            "commentator": commentator,
            "timestamp": time.time()
        })

# API Routes
@app.get("/")
def read_root():
    return {
        "message": "Beer Pong Commentary API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/games", response_model=Game)
def create_game():
    """Create a new game session"""
    game = Game()
    game.current_state = GameState(
        red_full=10, red_half=0, red_empty=0,
        blue_full=10, blue_half=0, blue_empty=0
    )
    games_db[game.id] = game
    return game

@app.get("/api/games", response_model=List[Game])
def list_games():
    """List all available games"""
    return list(games_db.values())

@app.get("/api/games/{game_id}", response_model=Game)
def get_game_by_id(game_id: str):
    """Get a specific game by ID"""
    return get_game(game_id)

@app.post("/api/games/{game_id}/actions", response_model=Action)
def add_action(game_id: str, action: Action, background_tasks: BackgroundTasks):
    """Add a new action to a game and generate commentary asynchronously"""
    game = get_game(game_id)
    
    # Validate player
    if action.player not in ['A', 'B', 'C', 'D']:
        raise HTTPException(status_code=400, detail="Invalid player ID. Must be A, B, C, or D.")
    
    # Add action to game
    game.actions.append(action)
    
    # Update game state based on action
    update_game_state(game, action)
    
    # Generate commentary asynchronously
    background_tasks.add_task(
        generate_and_save_commentary, 
        game_id=game_id, 
        action=action.dict(), 
        game_state=game.current_state.dict()
    )
    
    return action

@app.get("/api/games/{game_id}/commentaries")
def get_commentaries(game_id: str):
    """Get all commentaries for a game"""
    game = get_game(game_id)
    return game.commentaries

@app.get("/api/games/{game_id}/latest-commentary", response_model=CommentaryResponse)
def get_latest_commentary(game_id: str):
    """Get the latest commentary for a game"""
    game = get_game(game_id)
    if not game.commentaries:
        return CommentaryResponse(commentary=None, commentator=None, timestamp=time.time())
    
    latest = game.commentaries[-1]
    return CommentaryResponse(
        commentary=latest["commentary"],
        commentator=latest.get("commentator", "Unknown"),
        timestamp=latest["timestamp"]
    )

@app.post("/api/commentary", response_model=CommentaryResponse)
def generate_commentary(request: CommentaryRequest):
    """Generate commentary for a given action and game state"""
    commentary = commentary_manager.generate_commentary(
        request.action.dict(), 
        request.game_state.dict()
    )
    commentator = commentary_manager.commentator_personalities[commentary_manager.current_commentator]
    
    return CommentaryResponse(
        commentary=commentary,
        commentator=commentator,
        timestamp=time.time()
    )

@app.post("/api/games/{game_id}/load-log", response_model=GameResponse)
def load_game_log(game_id: str, file_path: str = "test_game_logs/new_pong_short.json"):
    """Load a game log from a file"""
    game = get_game(game_id)
    
    try:
        with open(file_path, 'r') as f:
            actions = json.load(f)
        
        # Reset the game
        game.actions = []
        game.commentaries = []
        game.current_state = GameState(
            red_full=10, red_half=0, red_empty=0,
            blue_full=10, blue_half=0, blue_empty=0
        )
        
        # Add each action from the log
        for action_data in actions:
            action = Action(**action_data)
            game.actions.append(action)
            update_game_state(game, action)
            
            # Generate commentary synchronously for this endpoint
            commentary = commentary_manager.generate_commentary(
                action.dict(), 
                game.current_state.dict()
            )
            if commentary:
                commentator = commentary_manager.commentator_personalities[commentary_manager.current_commentator]
                game.commentaries.append({
                    "action": action.dict(),
                    "commentary": commentary,
                    "commentator": commentator,
                    "timestamp": time.time()
                })
        
        return GameResponse(
            game=game,
            message=f"Loaded {len(actions)} actions from {file_path}"
        )
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File {file_path} not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format in {file_path}")

@app.delete("/api/games/{game_id}")
def delete_game(game_id: str):
    """Delete a game"""
    if game_id not in games_db:
        raise HTTPException(status_code=404, detail=f"Game with ID {game_id} not found")
    
    del games_db[game_id]
    return {"message": f"Game {game_id} deleted successfully"}

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True) 