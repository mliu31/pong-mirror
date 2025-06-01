# Beer Pong Commentary API Backend

A FastAPI backend service that provides AI-powered commentary for beer pong games using Mistral 7B.

## Features

- **Game Management**: Create, track, and manage beer pong game sessions
- **AI Commentary**: Generate real-time commentary using Mistral 7B AI model
- **Action Tracking**: Record and process game actions (serve, rally, hit, sink)
- **Game State Management**: Track cup status and team scores
- **Game Log Loading**: Load pre-recorded game logs for testing
- **RESTful API**: Clean REST endpoints for frontend integration
- **CORS Support**: Ready for React Native and web frontend integration

## Quick Start

### Prerequisites

- Python 3.8+
- Mistral AI API key

### Installation

1. **Clone and navigate to the backend directory**

   ```bash
   cd ai-commentary-service
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**

   ```bash
   cp env.example .env
   # Edit .env and add your Mistral API key
   ```

5. **Run the server**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:

- **Interactive API docs**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

## Core Endpoints

### Game Management

- `POST /api/games` - Create a new game
- `GET /api/games` - List all games
- `GET /api/games/{game_id}` - Get specific game
- `DELETE /api/games/{game_id}` - Delete a game

### Game Actions

- `POST /api/games/{game_id}/actions` - Add action to game
- `GET /api/games/{game_id}/commentaries` - Get all commentaries
- `GET /api/games/{game_id}/latest-commentary` - Get latest commentary

### Utility

- `POST /api/games/{game_id}/load-log` - Load game from log file
- `POST /api/commentary` - Generate standalone commentary
- `GET /health` - Health check

## Game Actions

The API supports these action types:

- **serve**: Player serves the ball
- **rally**: Ball is in play
- **hit**: Ball hits a cup (cup becomes half-full)
- **sink**: Ball sinks in a cup (cup becomes empty)

## Players and Teams

- **Team Red**: Players A and B
- **Team Blue**: Players C and D

## Game State

The API tracks:

- Cup counts per team (full, half, empty)
- Action history
- Commentary history
- Game metadata

## Example Usage

### Create a Game

```bash
curl -X POST http://localhost:8000/api/games
```

### Add an Action

```bash
curl -X POST http://localhost:8000/api/games/{game_id}/actions \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": 1234567890,
    "type": "serve",
    "player": "A"
  }'
```

### Get Latest Commentary

```bash
curl http://localhost:8000/api/games/{game_id}/latest-commentary
```

## Configuration

Environment variables (set in `.env`):

- `MISTRAL_API_ENDPOINT`: Mistral API endpoint URL
- `MISTRAL_API_KEY`: Your Mistral API key
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `ENVIRONMENT`: Environment type (development/production)

## Development

### Project Structure

```
ai-commentary-service/
├── main.py              # Main FastAPI application
├── game_simulator.py    # Commentary generation logic
├── requirements.txt     # Python dependencies
├── env.example         # Environment configuration template
├── test_game_logs/     # Sample game logs for testing
└── README_BACKEND.md   # This file
```

### Running in Development

```bash
python main.py
```

### Running in Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Testing

The API includes test game logs in `test_game_logs/`:

- `new_pong_short.json` - Short game example
- `new_pong_medium.json` - Medium game example
- `new_pong_long.json` - Long game example

Load them using:

```bash
curl -X POST "http://localhost:8000/api/games/{game_id}/load-log?file_path=test_game_logs/new_pong_short.json"
```

## Frontend Integration

This backend is designed to work with React Native frontends. Key integration points:

1. **CORS**: Enabled for all origins (configure for production)
2. **JSON API**: All endpoints use JSON request/response
3. **Error Handling**: Consistent HTTP status codes and error messages
4. **Async Commentary**: Commentary generation happens in background
5. **Real-time Updates**: Poll latest commentary endpoint for updates

## Deployment

For production deployment:

1. Set environment variables properly
2. Use a production WSGI server (uvicorn with workers)
3. Configure CORS for specific frontend domains
4. Add proper logging and monitoring
5. Use a real database instead of in-memory storage

## License

This project is part of the CS98 coursework.
