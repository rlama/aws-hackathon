import { AWS_API_GATEWAY_ENDPOINT } from "../config/gameConfig";

// Fetches the current Leaderboard 
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

        if(response.status !== 200) {
            throw new Error("@ server, getting leaderboard. Check back in few minutes.");
        }
        const res = await response.json();
        return res.data;

    } catch (error) {
        console.error('Error fetching scores:', error);
        throw new Error("@ server, getting leaderboard. Check back in few minutes.");

    }
}


// Checks if name already exists
export const checkNameAlreadyExists = async (name, uid) => {
    try {
        const options = {
            data: {
                name,
                uid
            },
            type: 'check'
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
        return res.data;

    } catch (error) {
        console.error('Error fetching scores:', error);
        throw error;

    }
}


// Save the player's score to Leaderboard
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
