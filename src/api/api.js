import { AWS_API_GATEWAY_ENDPOINT } from "../config/gameConfig";

export const fetchLeaderboard = async (level) => {
    try {
        const options = {
            data: {
                level
            },
            type: 'get'
        }

        // Call Lambda function through API Gateway
        const response = await fetch(AWS_API_GATEWAY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(options)
        })
        const res = await response.json();
        const scores = res.data;

        return scores;

    } catch (error) {
        console.error('Error fetching scores:', error);
        throw error;

    }
}



export const saveToLeaderboard = async(_score) => {

    try {
        const scoreToSave = {
            data: {
                playerName: _score.playerName,
                selectedCharacter: _score.selectedCharacter,
                score: _score.score,
                opponent: _score.opponent,
                statesWon: _score.statesWon,
                level: _score.level,
                gameId: "cb-01"
            },
            type: 'save'
        }

        // Call Lambda function through API Gateway
        const response = await fetch(AWS_API_GATEWAY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scoreToSave)
        })
        const res = await response.json();

        return res.data;

    } catch (error) {
        console.error('Error fetching scores:', error);
        throw error;

    }

}
