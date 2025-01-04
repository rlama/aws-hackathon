# Chad & Barry: A game with Amazon Q Developer 🗳️

A simple catch-and-collect game with a twist. Amazon Q is pushed to its limit to write a clean and efficient code for the AWS game building challenge.

## 🎮 Game Overview

Chad & Barry is an exciting arcade-style game where players race to reach 270 electoral votes by collecting falling items while avoiding obstacles, the onions. Choose your candidate and compete against an opponent in this political-themed adventure!

## 🚀 Installation

[Add installation instructions here, for example:]
1. Clone or download the repository:
   ```bash
   git clone git@github.com:rlama/aws-hackathon.git
   ```


2. Development server
    ```bash
    yarn dev
    ```

3. Build for production
    ```bash
    yarn build
    ```

## AWS services used
The game was built using Phaser.js, a canvas-based game library.  
It user several services from AWS.
+ It’s hosted on **[AWS S3](https://aws.amazon.com/s3/)** and served lightning-fast with **[AWS CloudFront](https://aws.amazon.com/cloudfront/)**. 
+ The game uses the REST API created with **[AWS API Gateway](https://aws.amazon.com/api-gateway/)**, which smoothly handles all game requests to fetch and update leaderboard scores. 
+ **[AWS Lambda](https://aws.amazon.com/lambda/)** is used to process scores and rankings effortlessly while scaling automatically with player traffic.
+ Finally Game users **[AWS DynamoDB](https://aws.amazon.com/dynamodb/)** to securely store and retrieve leaderboard scores.


## 🎯 How to Play

### Character Selection
- Choose between two candidates: Chad or Barry
- The unselected character becomes your robot opponent

### Game Controls
- **Mouse Click** or **'M' key**: Open your character's mouth to collect items
- **Spacebar** or **⚙️ Gear Icon**: Pause game and access settings

### Gameplay Mechanics
1. **Vote Collection**: Catch falling objects to score points "votes"
2. **Avoid Onions** 🧅: Getting an onion disables your character for 3.5 seconds
3. **State Victories**: Score points to light up U.S. states on the map
4. **Victory Condition**: First candidate to reach 270 points wins!

## 🎚️ Difficulty Levels

The game offers three difficulty settings:
- **Beginner**: Standard AI opponent behavior
- **Intermediate**: Enhanced AI intelligence and faster recovery
- **Expert**: Maximum AI difficulty with quickest recovery time

## 🏆 Leaderboard System

### Ranking Criteria
1. Only winners are eligible for the leaderboard
2. Rankings are determined by the number of states won
3. In case of a tie, the opponent's final score serves as the tiebreaker


