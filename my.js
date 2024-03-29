/**
 * This function is called the first time that the Realtime model is created
 * for a file. This function should be used to initialize any values of the
 * model. In this case, we just create the single string model that will be
 * used to control our text box. The string has a starting value of 'Hello
 * Realtime World!', and is named 'text'.
 * @param model {gapi.drive.realtime.Model} the Realtime root model object.
 */
function initializeModel(model) {
    var string = model.createString('Hello Realtime World!');
    model.getRoot().set('text', string);
    
    var array = [true, false, true];
    var myList = model.createList(array);
    model.getRoot().set('myList', myList);
}

/**
 * This function is called when the Realtime file has been loaded. It should
 * be used to initialize any user interface components and event handlers
 * depending on the Realtime model. In this case, create a text control binder
 * and bind it to our string model that we created in initializeModel.
 * @param doc {gapi.drive.realtime.Document} the Realtime document.
 */
function onFileLoaded(doc) {
    var string = doc.getModel().getRoot().get('text');

    // Keeping one box updated with a String binder.
    var textArea1 = document.getElementById('editor1');
    gapi.drive.realtime.databinding.bindString(string, textArea1);

    // Keeping one box updated with a custom EventListener.
    var textArea2 = document.getElementById('editor2');
    var updateTextArea2 = function(e) {
        textArea2.value = string;
    };
    string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, updateTextArea2);
    string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, updateTextArea2);
    textArea2.onkeyup = function() {
        string.setText(textArea2.value);
    };
    updateTextArea2();

    // Enabling UI Elements.
    textArea1.disabled = false;
    textArea2.disabled = false;

    // Add logic for undo button.
    var model = doc.getModel();
    var undoButton = document.getElementById('undoButton');
    var redoButton = document.getElementById('redoButton');

    undoButton.onclick = function(e) {
        model.undo();
    };
    redoButton.onclick = function(e) {
        model.redo();
    };

    // Add event handler for UndoRedoStateChanged events.
    var onUndoRedoStateChanged = function(e) {
        undoButton.disabled = !e.canUndo;
        redoButton.disabled = !e.canRedo;
    };
    model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, onUndoRedoStateChanged);
    
    /*
     * own implementation stuff
     */
    var myList = doc.getModel().getRoot().get('myList');
    
    var ownButton = document.getElementById('own_button');
    ownButton.onclick = function(e) {
        myList.set(0, !myList.get(0));
    };
    
    var onOwnButtonClick = function(e){
        ownButton.disabled = true;
    };
    
    myList.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, onOwnButtonClick);
}

/**
 * Options for the Realtime loader.
 */
var realtimeOptions = {
    /**
     * Client ID from the APIs Console.
     */
    clientId: '621468593885-n0v35hcfgnn2h2iq32e6n3bvq52954g6.apps.googleusercontent.com',
    /**
     * The ID of the button to click to authorize. Must be a DOM element ID.
     */
    authButtonElementId: 'authorizeButton',
    /**
     * Function to be called when a Realtime model is first created.
     */
    initializeModel: initializeModel,
    /**
     * Autocreate files right after auth automatically.
     */
    autoCreate: true,
    /**
     * Autocreate files right after auth automatically.
     */
    defaultTitle: "New Realtime Quickstart File",
    /**
     * Function to be called every time a Realtime file is loaded.
     */
    onFileLoaded: onFileLoaded
}

/**
 * Start the Realtime loader with the options.
 */
function startRealtime() {
    var realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
    realtimeLoader.start();
}