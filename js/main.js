// global var for settings in comment font weight and color
let globalCommentSettings = {color: 'black', fontWeight: '400', background: 'white'}
// total amount of comments on the page, initially 0
let numComments = 0
// display comment count on the page
document.getElementById('commentCounter').innerHTML = `Total number of comments: ${numComments}`
// font colors for user comments
const colorSettingsItems = [
    {name: 'black'}, {name: 'red'}, {name: 'green'}, {name: 'blue'}, {name: 'customFontColor'}
];
// fontWeight settings for user comments
const fontWeightSettingsItems = [
    {name: 'normal'}, {name: 'lighter'}, {name: 'bold'}, {name: 'bolder'}, {name: 'customFontWeight'}
];
// background colors for user comments
const backgroundColorSettingsItems = [
    {name: 'Backgroundwhite'}, {name: 'Backgroundred'}, {name: 'Backgroundgreen'}, {name: 'Backgroundblue'}, {name: 'customBackgroundColor'}
];
// append settings elements to the page
function appendSettings(array, location) {
    array.forEach( ({name}) => {
        // create list item
        const menuItem = document.createElement('li')
        // if settings option is custom, then add the input for custom value
        if (name === 'customFontColor' || name === 'customFontWeight' || name === 'customBackgroundColor') {
            const menuItemInput = document.createElement('input');
            menuItemInput.setAttribute('placeholder', 'custom value');
            menuItemInput.setAttribute('id', `${name}Input`);
            menuItem.appendChild(menuItemInput);
        }
        // create the settings button
        const menuItemButton = document.createElement('button')
        // make button clickable and add id
        menuItemButton.setAttribute('onclick',`changeSettings("${name}")`);
        menuItemButton.setAttribute('id', `button${name}`)
        if (name === 'customFontColor' || name === 'customFontWeight' || name === 'customBackgroundColor') {
            name = name.substring(0, 6)
        }
        // if background color remove the name background from button titles
        if (name.substring(0, 10) === 'Background') {
           name = name.slice(10)
        }
        const menuItemText = document.createTextNode(name)
        menuItemButton.appendChild(menuItemText)
        menuItem.appendChild(menuItemButton)
        document.getElementById(location).appendChild(menuItem)
    })
}
appendSettings(colorSettingsItems, 'colorSettingsList')
appendSettings(fontWeightSettingsItems, 'fontWeightSettingsList')
appendSettings(backgroundColorSettingsItems, 'backgroundColorSettingsList')
// change global settings var
function changeSettings(item) {
    let colorVar = ['black', 'red', 'green', 'blue', 'customFontColor'].find(current => current === item);
    // if custom color, get it from the input
    if (colorVar) {
        if (colorVar === 'customFontColor') {
            colorVar = document.getElementById(`${item}Input`).value.trim();
            document.getElementById(`${item}Input`).value = ''
        }
        // set color
        globalCommentSettings.color = colorVar ? colorVar : 'black';
        // set the color of the input fields
        document.getElementById("username").style.color = globalCommentSettings.color;
        document.getElementById("commentBody").style.color = globalCommentSettings.color;
    }
    let backgroundVar = ['Backgroundwhite', 'Backgroundred', 'Backgroundgreen', 'Backgroundblue', 'customBackgroundColor'].find(current => current === item);
    if (backgroundVar) {
        // if custom background
        if (backgroundVar === 'customBackgroundColor') {
            backgroundVar = document.getElementById(`${item}Input`).value.trim();
            document.getElementById(`${item}Input`).value = '';
            globalCommentSettings.background = backgroundVar ? backgroundVar : 'white';
            // set background color of the input fields
            document.getElementById("username").style.backgroundColor = globalCommentSettings.background;
            document.getElementById("commentBody").style.backgroundColor = globalCommentSettings.background;
        } else {
            // set background color
            globalCommentSettings.background = backgroundVar ? backgroundVar.slice(10) : 'white';
            console.log(globalCommentSettings.background);
            // set background color of the input fields
            document.getElementById("username").style.backgroundColor = globalCommentSettings.background;
            document.getElementById("commentBody").style.backgroundColor = globalCommentSettings.background;
            console.log(document.getElementById("commentBody").style)
        }
    }

    // possible font weights
    const fontWeights = ['normal', 'lighter', 'bold', 'bolder', 'customFontWeight']
    // add all possible number values for font weights
    for (let i = 100; i <= 900; i = i + 100) {fontWeights.push(i.toString())}
    // if custom value, obtain custom value from input field
    if (item === 'customFontWeight') {
        item = document.getElementById(`${item}Input`).value.trim();
        document.getElementById('customFontWeightInput').value = '';
    }
    const fontWeightVar = fontWeights.find(current => current === item);
    if (fontWeightVar) {
        //set font weight, default is 400
        globalCommentSettings.fontWeight = fontWeightVar ? fontWeightVar : '400';
        document.getElementById('username').style.fontWeight = globalCommentSettings.fontWeight;
        document.getElementById('commentBody').style.fontWeight = globalCommentSettings.fontWeight;
    }
    // display new settings
    displaySettings();
}
// display the current settings to the user
function displaySettings() {
    // set the weight of the settings par to the selected weight
    document.getElementById('settingsPar').style.fontWeight = globalCommentSettings.fontWeight;
    // set the background of the settings par to selected background
    document.getElementById('settingsPar').style.backgroundColor = globalCommentSettings.background;
    // set the color of the settings par to the selected color
    const colorString = `Your comment style:<br>Text color: ${globalCommentSettings.color}, `.fontcolor(globalCommentSettings.color);
    const background = `background color: ${globalCommentSettings.background}, `.fontcolor(globalCommentSettings.color);
    const fontWeightString = `font weight: ${globalCommentSettings.fontWeight}`.fontcolor(globalCommentSettings.color);
    document.getElementById('colorPar').innerHTML = colorString;
    document.getElementById('backgroundPar').innerHTML = background;
    document.getElementById('fontWeightPar').innerHTML = fontWeightString;
}
displaySettings();
// validate user inputs
function validateForm() {
    // error message
    let helperText = document.createTextNode("");
    // clear any helper text that is already there
    document.getElementById('helperMessage').innerHTML = ""
    const username = document.getElementById('username').value.trim();
    const commentBody = document.getElementById('commentBody').value.trim();
    // if form passes validation
    if ( [username, commentBody].every(item => item !== '') ) {
        document.getElementById('helperMessage').appendChild(helperText);
        addComment('commentList', username, commentBody, globalCommentSettings.color, globalCommentSettings.background, globalCommentSettings.fontWeight);
        // clear text fields
        document.getElementById('username').value = ""
        document.getElementById('commentBody').value = ""
    // if form doesnt pass validation
    } else {
        helperText = document.createTextNode("username and comment or username and sticker are required");
        document.getElementById('helperMessage').appendChild(helperText);
    }
}
function addComment(messageLocation, authorName, messageContent, messageColor = null, messageBackground = null, messageWeight = null) {
    /* displayMessage function is used when a message needs to be displayed to the user, it takes 4 arguments:
    messageLocation - string - id of the element in which the message is to be displayed
    authorName - string - name of the comment author
    messageContent - string - the actual words of the comment
    messageColor (optional) - string - black by default - the color of the message string.
    messageWeight (optional) - string - 400 by default - the font weight of the message */
    const comment = document.createElement('li');
    comment.setAttribute('id', `numComments${numComments}`);
    comment.className = 'comment';
    const coloredAuthor = messageColor ? authorName.fontcolor(messageColor) : 'black';
    const coloredMessage = messageColor ? messageContent.fontcolor(messageColor) : 'black';
    comment.innerHTML = (`
        <p class="commentAuthor${numComments}">${coloredAuthor}</p>
        <p class="commentBody${numComments}">${coloredMessage}</p>
    `)
    document.getElementById(messageLocation).appendChild(comment);
    messageWeight ? document.getElementById(`numComments${numComments}`).style.fontWeight = messageWeight : document.getElementById(`numComments${numComments}`).style.fontWeight = "400";
    messageBackground ? document.getElementById(`numComments${numComments}`).style.backgroundColor = messageBackground : document.getElementById(`numComments${numComments}`).style.backgroundColor = "white";
    // incriment comment Count By One
    numComments ++;
    // display comment count on the page
    document.getElementById('commentCounter').innerHTML = `Total number of comments: ${numComments}`
}