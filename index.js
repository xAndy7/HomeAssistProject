
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
        if(Object.keys(this.attributes).length === 0){
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
            this.response.speak("Welcome to home assist. Please start by saying I want to input my data").listen("Please start by saying I want to input my data");
        }
        else{
            var patient = this.attributes.healthscores.patientID;
            var feeling = this.attributes.healthscores.scores['feeling'].score;
            var sleeping = this.attributes.healthscores.scores['sleeping'].score;
            var breathing = this.attributes.healthscores.scores['breathing'].score;
            var swollen = this.attributes.healthscores.scores['swollen'].score;

            //var feeling = this.attrbiutes.healthscores.

            this.response.speak("Welcome back to home assist patient " + patient + 
            ". Your feeling score is currently " + feeling + 
            ". Your sleeping score is currently " + sleeping + 
            ". Your breathing score is currently " + breathing + 
            " . Your swollen score is currently " + swollen + ". Which score would you like to update?").listen("Which score would you like to update?");
            
        }
        this.emit(':responseReady');


        //this.emit('HomeAssistQuestions');
        //this.emitWithState("HomeAssistQuestions");
    },
    'HomeAssistQuestions': function () {
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
        var id_attr = this.attributes.healthscores.patientID;
        var feeling_attr = this.attributes.healthscores.scores['feeling'].score;
        var sleeping_attr = this.attributes.healthscores.scores['sleeping'].score;
        var breathing_attr = this.attributes.healthscores.scores['breathing'].score;
        var swollen_attr = this.attributes.healthscores.scores['swollen'].score;

        if(this.event.request.dialogState !== 'COMPLETED'){
            if (this.event.request.intent.slots.feelingRating.value == '?' || this.event.request.intent.slots.feelingRating.value < 1 || this.event.request.intent.slots.feelingRating.value > 10) { 
                let prompt = "Sorry I didn't hear rating for how you feel or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'feelingRating', prompt, reprompt); 
            } 
            else{
                this.emit(':delegate');
            }
        }
        else{
            const feelingScore = this.event.request.intent.slots.feelingRating.value;
            this.attributes.healthscores.scores['feeling'].score = feelingScore;
            feeling_attr = this.attributes.healthscores.scores['feeling'].score;


            request.get(url(id_attr, feeling_attr, sleeping_attr, breathing_attr, swollen_attr), function(err, res, body) {  
                console.log(body);
            });
            this.response.speak("Feeling score successfully updated");
            this.emit(':responseReady');
        }

    },
    'SleepingQuestions': function() {
        var id_attr = this.attributes.healthscores.patientID;
        var feeling_attr = this.attributes.healthscores.scores['feeling'].score;
        var sleeping_attr = this.attributes.healthscores.scores['sleeping'].score;
        var breathing_attr = this.attributes.healthscores.scores['breathing'].score;
        var swollen_attr = this.attributes.healthscores.scores['swollen'].score;

        if(this.event.request.dialogState !== 'COMPLETED'){
            if (this.event.request.intent.slots.sleepingRating.value == '?' || this.event.request.intent.slots.sleepingRating.value < 1 || this.event.request.intent.slots.sleepingRating.value > 10) {
                let prompt = "Sorry I didn't hear your rating for your sleeping score or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'sleepingRating', prompt, reprompt);
            } 
            else{
                this.emit(':delegate');
            }
        }
        else{
            const sleepingScore = this.event.request.intent.slots.sleepingRating.value;
            this.attributes.healthscores.scores['sleeping'].score = sleepingScore;
            sleeping_attr = this.attributes.healthscores.scores['sleeping'].score;
            request.get(url(id_attr, feeling_attr, sleeping_attr, breathing_attr, swollen_attr), function(err, res, body) {  
                console.log(body);
            });

            this.response.speak("Sleeping score successfully updated");
            this.emit(':responseReady');
        }
    },
    'BreathingQuestions': function() {
        var id_attr = this.attributes.healthscores.patientID;
        var feeling_attr = this.attributes.healthscores.scores['feeling'].score;
        var sleeping_attr = this.attributes.healthscores.scores['sleeping'].score;
        var breathing_attr = this.attributes.healthscores.scores['breathing'].score;
        var swollen_attr = this.attributes.healthscores.scores['swollen'].score;

        if(this.event.request.dialogState !== 'COMPLETED'){
            if (this.event.request.intent.slots.breathingRating.value == '?' || this.event.request.intent.slots.breathingRating.value < 1 || this.event.request.intent.slots.breathingRating.value > 10) {
                let prompt = "Sorry I didn't hear your breathing rating or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'breathingRating', prompt, reprompt); 
            } 
            else{
                this.emit(':delegate');
            }
        }
        else{
            const breathingScore = this.event.request.intent.slots.breathingRating.value;
            this.attributes.healthscores.scores['breathing'].score = breathingScore;
            breathing_attr = this.attributes.healthscores.scores['breathing'].score;
            request.get(url(id_attr, feeling_attr, sleeping_attr, breathing_attr, swollen_attr), function(err, res, body) {  
                console.log(body);
            });


            this.response.speak("Breathing score successfully updated");
            this.emit(':responseReady');
        }
    },
    'SwollenQuestions': function() {
        var id_attr = this.attributes.healthscores.patientID;
        var feeling_attr = this.attributes.healthscores.scores['feeling'].score;
        var sleeping_attr = this.attributes.healthscores.scores['sleeping'].score;
        var breathing_attr = this.attributes.healthscores.scores['breathing'].score;
        var swollen_attr = this.attributes.healthscores.scores['swollen'].score;

        if(this.event.request.dialogState !== 'COMPLETED'){
            if (this.event.request.intent.slots.breathingRating.value == '?' || this.event.request.intent.slots.SwollenRating.value < 1 || this.event.request.intent.slots.SwollenRating.value > 10) {
                let prompt = "Sorry I didn't hear your swollen rating or you didnt't give me a number from one to ten";
                let reprompt = "Tell me how you feel from one to ten";
                this.emit(':elicitSlot', 'SwollenRating', prompt, reprompt); 
            } 
            else{
                this.emit(':delegate');
            }
        }
        else{
            const swollenScore = this.event.request.intent.slots.SwollenRating.value;
            this.attributes.healthscores.scores['swollen'].score = swollenScore;
            swollen_attr = this.attributes.healthscores.scores['swollen'].score;

            request.get(url(id_attr, feeling_attr, sleeping_attr, breathing_attr, swollen_attr), function(err, res, body) {  
                console.log(body);
            });
            
            this.response.speak("Swollen score successfully updated");
            this.emit(':responseReady');
        }
    },
    'UpdateIntent': function(){
        if(this.event.request.intent.slots.value.value == "feeling"){
            this.response.speak("Feeling selected");
            this.emit(":responseReady");
            //this.emitWithState("FeelingQuestions");
        }
        else if(this.event.request.intent.slots.value.value == "sleeping"){
            this.response.speak("sleeping selected");
            this.emit(":responseReady");
        }
        else if(this.event.request.intent.slots.value.value == "breathing"){
            this.response.speak("breathing selected");
            this.emit(":responseReady");
        }
        else if(this.event.request.intent.slots.value.value == "swollen"){
            this.response.speak("swollen selected");
            this.emit(":responseReady");
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
