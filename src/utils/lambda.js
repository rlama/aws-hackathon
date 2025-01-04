import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
    region: "us-east-1" // Change to your region
});

const modelId = "meta.llama3-8b-instruct-v1:0";

export const checkUserName = async (username) => {

    try {
       
        const prompt = `<s>[INST] You are a username validator. For the username "${username}", check if it:
        1. Looks like a human name (not random letters/numbers)
        2. Contains only letters, with optional 0-3 numbers at the end
        3. Has no special characters

        Respond with a single word: either "true" if it's valid or "false" if invalid.
        Just the word, nothing else. [/INST]</s>`;
        
        const params = {
            modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                prompt: prompt,
                temperature: 0.1,
                top_p: 0.9,
                max_gen_len: 10
            })
        };
        
        const command = new InvokeModelCommand(params);
        const response = await bedrockClient.send(command);
        
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const isValid = responseBody.generation.trim().toLowerCase() === 'true';
        
        // Additional regex check for numbers at the end
        const numberPattern = /^[a-zA-Z]+[0-9]{0,3}$/;
        const hasValidFormat = numberPattern.test(username);
        

        const result = isValid && hasValidFormat;


        return result;

        // const finalResult = {
        //     isValid: result.isValid && hasValidNumberFormat,
        //     reason: hasValidNumberFormat ? 
        //             result.reason : 
        //             "Username must be letters with optional 0-3 numbers at the end"
        // };
        // return {
        //     statusCode: 200,
        //     body: JSON.stringify(finalResult)
        // };

    } catch (error) {
        console.error('Error:', error);
        throw error;
        // return {
        //     statusCode: 500,
        //     body: JSON.stringify({
        //         isValid: false,
        //         reason: "Error processing username validation"
        //     })
        // };
    }
};
