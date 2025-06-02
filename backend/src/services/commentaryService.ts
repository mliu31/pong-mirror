import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface BeerPongAction {
  timestamp: number;
  type: 'serve' | 'rally' | 'hit' | 'sink';
  player: string; // This will be the player letter (A, B, C, D)
  playerName?: string; // Add the real player name
}

export interface GameState {
  red_full: number;
  red_half: number;
  red_empty: number;
  blue_full: number;
  blue_half: number;
  blue_empty: number;
}

export interface Commentary {
  commentary: string;
  commentator: string;
  timestamp: number;
}

type CommentatorIndex = 0 | 1;
type CommentatorName = 'John' | 'Jane';

export class CommentaryService {
  private apiEndpoint: string;
  private apiKey: string;
  private commentaryHistory: string[] = [];
  private lastCommentaryTime: number = 0;
  private commentaryCooldown: number = 1.0; // seconds
  private currentCommentator: CommentatorIndex = 0; // 0 for John, 1 for Jane

  private commentatorPersonalities: Record<CommentatorIndex, CommentatorName> =
    {
      0: 'John', // Professional and analytical commentator
      1: 'Jane' // Energetic and humorous commentator
    };

  private commentatorStyles: Record<
    CommentatorName,
    { style: string; catchphrases: string[] }
  > = {
    John: {
      style: 'professional and analytical',
      catchphrases: [
        "Let's analyze this play...",
        'From a strategic perspective...',
        'The key factor here is...',
        'Looking at the statistics...'
      ]
    },
    Jane: {
      style: 'energetic and humorous',
      catchphrases: [
        'OH MY GOODNESS!',
        'This is absolutely INSANE!',
        "I can't believe what we're seeing!",
        'The crowd is going WILD!'
      ]
    }
  };

  constructor() {
    this.apiEndpoint =
      process.env.MISTRAL_API_ENDPOINT ||
      'https://api.mistral.ai/v1/chat/completions';
    this.apiKey = process.env.MISTRAL_API_KEY || '';

    if (!this.apiKey) {
      console.warn(
        'Mistral API key not found. Commentary will use fallback mode.'
      );
    }
  }

  async generateCommentary(
    action: BeerPongAction,
    gameState: GameState
  ): Promise<Commentary | null> {
    const currentTime = Date.now() / 1000;

    // Check cooldown
    if (currentTime - this.lastCommentaryTime < this.commentaryCooldown) {
      return null;
    }

    this.lastCommentaryTime = currentTime;

    // Create prompt for AI
    const prompt = this.createPrompt(action, gameState);

    let commentary: string;

    try {
      if (this.apiKey) {
        commentary = await this.generateAICommentary(prompt);
      } else {
        commentary = this.generateFallbackCommentary(action, gameState);
      }
    } catch (error) {
      console.error('Error generating AI commentary:', error);
      commentary = this.generateFallbackCommentary(action, gameState);
    }

    // Add to history
    this.commentaryHistory.push(commentary);
    if (this.commentaryHistory.length > 5) {
      this.commentaryHistory.shift();
    }

    // Get current commentator name and switch for next time
    const commentatorName =
      this.commentatorPersonalities[this.currentCommentator];
    this.currentCommentator = (1 - this.currentCommentator) as CommentatorIndex;

    return {
      commentary,
      commentator: commentatorName,
      timestamp: currentTime
    };
  }

  private async generateAICommentary(prompt: string): Promise<string> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    const data = {
      model: 'mistral-7b',
      messages: [
        {
          role: 'system',
          content: `You are an exciting beer pong commentator with a unique personality. Your commentary should be:
1. Energetic and engaging - use exclamations and enthusiasm!
2. Include specific game context and strategy - mention cup positions and team dynamics
3. Reference previous plays and momentum - build a narrative
4. Use sports-like excitement and enthusiasm - like a professional sports commentator
5. Keep responses brief but impactful (max 2 sentences)
6. Include player names and team dynamics
7. Add personality - use catchphrases and unique expressions
8. Create tension and excitement - especially during important moments
9. Use beer pong specific terminology and references
10. React to the game situation with appropriate emotion`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.95,
      max_tokens: 150,
      top_p: 0.98,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    };

    const response = await axios.post(this.apiEndpoint, data, {
      headers,
      timeout: 5000
    });

    if (response.status === 200) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error(`API Error: ${response.status}`);
    }
  }

  private generateFallbackCommentary(
    action: BeerPongAction,
    _gameState: GameState
  ): string {
    const { type, player, playerName } = action;
    const team =
      player === 'A' || player === 'B' ? 'Red Dragons' : 'Blue Warriors';

    // Use real player name if available, otherwise use player letter
    const displayName = playerName || `Player ${player}`;

    // Generate context-aware fallback commentary
    if (type === 'sink') {
      return `INCREDIBLE! ${displayName} from ${team} just SANK that cup! The crowd is going wild!`;
    } else if (type === 'hit') {
      return `${displayName} from ${team} hits the rim! That's going to be a tough one to recover!`;
    } else if (type === 'serve') {
      return `Here comes ${displayName} from ${team} with a powerful serve! Let's see what they've got!`;
    } else {
      // rally
      return `The ball is flying between teams! ${displayName} from ${team} keeping the rally alive!`;
    }
  }

  private createPrompt(action: BeerPongAction, gameState: GameState): string {
    const { type, player, playerName, timestamp } = action;

    // Get team information
    const team = player === 'A' || player === 'B' ? 'Team 1' : 'Team 2';
    const teamName = team === 'Team 1' ? 'Red Dragons' : 'Blue Warriors';

    // Use real player name if available, otherwise use player letter
    const displayName = playerName || `Player ${player}`;

    // Get cup status information
    const { red_full, red_half, red_empty, blue_full, blue_half, blue_empty } =
      gameState;

    // Calculate team scores and momentum
    const redScore = red_empty * 2 + red_half;
    const blueScore = blue_empty * 2 + blue_half;
    const redMomentum =
      redScore > blueScore + 4
        ? 'dominating'
        : redScore < blueScore - 4
          ? 'struggling'
          : 'holding steady';
    const blueMomentum =
      blueScore > redScore + 4
        ? 'dominating'
        : blueScore < redScore - 4
          ? 'struggling'
          : 'holding steady';

    // Calculate game progress and tension
    const totalCups =
      red_full + red_half + red_empty + blue_full + blue_half + blue_empty;
    const gameProgress = ((red_empty + blue_empty) / totalCups) * 100;
    const gameTension =
      Math.abs(redScore - blueScore) <= 2
        ? 'high'
        : Math.abs(redScore - blueScore) <= 4
          ? 'moderate'
          : 'low';

    // Get current commentator info
    const commentator = this.commentatorPersonalities[this.currentCommentator];
    const otherCommentatorIndex = (1 -
      this.currentCommentator) as CommentatorIndex;
    const otherCommentator =
      this.commentatorPersonalities[otherCommentatorIndex];
    const commentatorStyle = this.commentatorStyles[commentator];
    const otherStyle = this.commentatorStyles[otherCommentator];

    // Format commentary history
    const commentaryHistory =
      this.commentaryHistory.length > 0
        ? this.commentaryHistory
            .slice(-3)
            .map((comment) => `- ${comment}`)
            .join('\n')
        : 'No previous commentary';

    // Create detailed prompt
    const prompt = `You are ${commentator}, a beer pong commentator. Your co-commentator is ${otherCommentator}.
Your style is ${commentatorStyle.style} - use phrases like: ${commentatorStyle.catchphrases.join(', ')}
${otherCommentator}'s style is ${otherStyle.style} - they use phrases like: ${otherStyle.catchphrases.join(', ')}

GAME OVERVIEW:
- Game Progress: ${gameProgress.toFixed(1)}% complete
- Time Elapsed: ${timestamp.toFixed(1)} seconds
- Game Tension: ${gameTension}

TEAM STATUS:
Red Dragons (Team 1):
- Full Cups: ${red_full}
- Half Cups: ${red_half}
- Empty Cups: ${red_empty}
- Current Momentum: ${redMomentum}

Blue Warriors (Team 2):
- Full Cups: ${blue_full}
- Half Cups: ${blue_half}
- Empty Cups: ${blue_empty}
- Current Momentum: ${blueMomentum}

CURRENT ACTION:
${displayName} from ${teamName} just performed: ${type}

RECENT COMMENTARY CONTEXT:
${commentaryHistory}

Generate exciting ${commentator}-style commentary for this action! Keep it brief but energetic (max 2 sentences).`;

    return prompt;
  }
}
