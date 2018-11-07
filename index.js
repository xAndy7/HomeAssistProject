
'use strict';
const Alexa = require('alexa-sdk');
var request = require('request');

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

function url(id, feeling, sleeping, breathing, swollen) {
    // return "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Albert+Einstein"
    //     const guessNum = parseInt(requestEnvelope.request.intent.slots.num.value, 10);
        return 'http://cms3.dclhealth.com/alexa_get/alexa_get_insert.php?patient_id='+id+'&response1='+feeling+'&response2='+sleeping+'&response3='+breathing+'&response4='+swollen;

}

function url2(){
    return "hello world";
}

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
            this.emit(':delegate');
        }
        else{
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

            request.get(url(id, feelingScore, sleepingScore, breathingScore, swollenScore), function(err, res, body) {  
                console.log(body);
            });

            this.response.speak("Health Scores Recorded");
            this.emit(':responseReady');
        }


    },
    'FeelingQuestions': function() {
        if(this.event.request.dialogState !== 'COMPLETED'){
            this.emit(':delegate');
        }
        else{
            const feelingScore = this.event.request.intent.slots.feelingRating.value;
            this.attributes.healthscores.scores['feeling'].score = feelingScore;

            this.response.speak(url2());
            //this.response.speak("Feeling score successfully updated");
            this.emit(':responseReady');
        }

    },
    'SleepingQuestions': function() {
        if(this.event.request.dialogState !== 'COMPLETED'){
            this.emit(':delegate');
        }
        else{
            const sleepingScore = this.event.request.intent.slots.sleepingRating.value;
            this.attributes.healthscores.scores['sleeping'].score = sleepingScore;

            this.response.speak("Sleeping score successfully updated");
            this.emit(':responseReady');
        }
    },
    'BreathingQuestions': function() {
        if(this.event.request.dialogState !== 'COMPLETED'){
            this.emit(':delegate');
        }
        else{
            const breathingScore = this.event.request.intent.slots.breathingRating.value;
            this.attributes.healthscores.scores['breathing'].score = breathingScore;

            this.response.speak("Breathing score successfully updated");
            this.emit(':responseReady');
        }
    },
    'SwollenQuestions': function() {
        if(this.event.request.dialogState !== 'COMPLETED'){
            this.emit(':delegate');
        }
        else{
            const swollenScore = this.event.request.intent.slots.SwollenRating.value;
            this.attributes.healthscores.scores['swollen'].score = swollenScore;

            this.response.speak("Swollen score successfully updated");
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
