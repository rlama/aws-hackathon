/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

// Lambda function to get scores
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: 'scores/'
        };

        // List all score files
        const s3Files = await s3.listObjectsV2(params).promise();
        
        // Get content of each file
        const scorePromises = s3Files.Contents.map(async (file) => {
            const scoreFile = await s3.getObject({
                Bucket: process.env.BUCKET_NAME,
                Key: file.Key
            }).promise();
            
            return JSON.parse(scoreFile.Body.toString());
        });

        const scores = await Promise.all(scorePromises);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(scores)
        };
    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Error fetching scores',
                error: error.message
            })
        };
    }
};
