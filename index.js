
'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Home Assist';
const HELP_MESSAGE = 'You can say I want to input my data';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('HomeAssistQuestions');
    },
    'HomeAssistQuestions': function () {
        this.attributes.healthscores = {
            'patientID' : 0,
            'scores': {
                'feeling': {
                    'score': 0
                },
                'sleeping': {
                    'score': 0
                },
                'breathing': {
                    'score': 0
                },
                'swollen': {
                    'score': 0
                }
            },

        };

        
        
            if(this.event.request.dialogState !== 'COMPLETED'){
                    //ID
            if (this.event.request.intent.slots.id.value == '?') {
                let prompt = "Sorry I didn't hear your ID number";
                let reprompt = "Can you give me your ID number";
                this.emit(':elicitSlot', 'id', prompt, reprompt, this.event.request.intent); 
            } 
            //Feeling
            else if (this.event.request.intent.slots.feelingRating.value == '?' || this.event.request.intent.slots.feelingRating.value < 1 || this.event.request.intent.slots.feelingRating.value > 10) { 
                let prompt = "Sorry I didn't hear rating for how you feel or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'feelingRating', prompt, reprompt); 
            } 
            //Sleeping
            else if (this.event.request.intent.slots.sleepingRating.value == '?' || this.event.request.intent.slots.sleepingRating.value < 1 || this.event.request.intent.slots.sleepingRating.value > 10) {
                let prompt = "Sorry I didn't hear your rating for your sleeping score or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'sleepingRating', prompt, reprompt);
            } 
            //Breathing
            else if (this.event.request.intent.slots.breathingRating.value == '?' || this.event.request.intent.slots.breathingRating.value < 1 || this.event.request.intent.slots.breathingRating.value > 10) {
                let prompt = "Sorry I didn't hear your breathing rating or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'breathingRating', prompt, reprompt); 
            } 
            //Swollen
            else if (this.event.request.intent.slots.SwollenRating.value == '?' || this.event.request.intent.slots.SwollenRating.value < 1 || this.event.request.intent.slots.SwollenRating.value > 10) {
                let prompt = "Sorry I didn't hear rating for your swollen rating or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'SwollenRating', prompt, reprompt); 
            }
            else{
                this.emit(':delegate');
            }
            
            }
                //Complete
                else {
                const feelingScore = this.event.request.intent.slots.feelingRating.value;
                const sleepingScore = this.event.request.intent.slots.sleepingRating.value;
                const breathingScore = this.event.request.intent.slots.breathingRating.value;
                const swollenScore = this.event.request.intent.slots.SwollenRating.value;
                const id = this.event.request.intent.slots.id.value;
    
                
                this.attributes.healthscores.patientID = id;
                this.attributes.healthscores.scores['feeling'].score = feelingScore;
                this.attributes.healthscores.scores['sleeping'].score = sleepingScore;
                this.attributes.healthscores.scores['breathing'].score = breathingScore;
                this.attributes.healthscores.scores['swollen'].score = swollenScore;
    
                //var request = require('request');
                //request.post('http://cms3.dclhealth.com/alexa_get/alexa_get_insert.php?patient_id=' + id + '&response1=' + feelingScore + '&response2' + sleepingScore);
                
                this.response.speak("Health Scores Recorded");
                this.emit(':responseReady');
            }


    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function(){
        this.emit('saveState', true);
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'HealthScores';
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
