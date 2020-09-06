const welcomingMessage = document.querySelector("#welcomingMessage");
const Jarvis = document.querySelector("#Jarvis");
const userInput = document.querySelector('#userInput');
const inputBox = document.querySelector('#inputBox');
const dummyBox = document.querySelector('#dummyBox');
const inputCursor = document.querySelector("#cursor");
const fontSizeBar = document.getElementById("fontSize");

function setVariableInterval(callbackFunc, timing) {
    var variableInterval = {
      interval: timing,
      callback: callbackFunc,
      stopped: false,
      runLoop: function() {
        if (variableInterval.stopped) return;
        var result = variableInterval.callback.call(variableInterval);
        if (typeof result == 'number')
        {
          if (result === 0) return;
          variableInterval.interval = result;
        }
        variableInterval.loop();
      },
      stop: function() {
        this.stopped = true;
        window.clearTimeout(this.timeout);
      },
      start: function() {
        this.stopped = false;
        return this.loop();
      },
      loop: function() {
        this.timeout = window.setTimeout(this.runLoop, this.interval);
        return this;
      }
    };
  
    return variableInterval.start();
}

//words per minutes
const typeSpeed = 200;
const message1 = "Welcome... My name is Jarvis.∫If you are new to CLI, type in \"-help\" and hit Enter.∫Let's see what I can do for you.∫"
const messageHelp = "currently nothing sorry...∫"
desktopInit();

function desktopInit(){
    putMessageOnScreen(welcomingMessage, message1, 'jarvis', 0);
    setupTerminal();
    setupPanel();

    userInput.addEventListener('click', (e)=>{
        dummyBox.focus();
        $('#cursor').css('background-color', 'lightsteelblue');
    })
}

function putMessageOnScreen(obj, src){
    let i = 0;
    let defaultSpeed = 60000/typeSpeed/6;
    let writer = setVariableInterval(()=>{
        writer.interval = defaultSpeed;
        if (i === src.length)  writer.stop();
        else if(src[i] === '.'){
            obj.innerHTML += '.';
            writer.interval *= 3;
        }
        else if(src[i] === '∫') {
            obj.innerHTML += "<br/>";
            scrollToCurrentLine();
            writer.interval *= 3;
        }
        else obj.innerHTML += src[i];
        ++i;

    }, defaultSpeed);
}

function setupTerminal(){
    dummyBox.addEventListener('keydown', (e) => {
        if(e.which === 13){
            let commandType = commandParser(inputBox.textContent);

            let text = ">> " + e.target.value;
            pushToWindow(text);
            scrollToCurrentLine();
            resetUserInput();

            if(commandType) {
                putMessageOnScreen(welcomingMessage, commandType);
                scrollToCurrentLine();
            }
        }
        setTimeout(writeToinputbox, 0);
    })
}

function commandParser(command){
    if(command === '-help') return messageHelp;
    else return ;
}

function setupPanel(){
    document.querySelectorAll("#controlPanel .themeButton").forEach(button => {
        button.addEventListener('click', () => {
            let themes = document.querySelectorAll("#controlPanel .themeButton").length;
            for(let i = 1; i <= themes; ++i){
                $('.jumbotron').removeClass("theme" + i);
            }
            $('.jumbotron').addClass(String(button.id));
        })
    })

    fontSizeBar.addEventListener('input', ()=>{
        welcomingMessage.style.fontSize = fontSizeBar.options[fontSizeBar.selectedIndex].value
    })

    $('#folder :nth-child(2)').toggle("slow", ()=>{})
}

function resetUserInput(){
    dummyBox.value = '';
}

async function writeToinputbox(){
    inputBox.textContent = dummyBox.value.substr(-30, 30);
}

function pushToWindow(text){
    welcomingMessage.innerHTML += ("<span class='usrText'>" + text+ "</span>" + "<br/>");
}

function scrollToCurrentLine(){
    welcomingMessage.innerHTML += "<i id='tmp'></i>";
    document.querySelector("#tmp").scrollIntoView();
    welcomingMessage.innerHTML = welcomingMessage.innerHTML.substring(0, welcomingMessage.innerHTML.length - 16);
}

$( "#folder" ).click(function() {
    $( "#welcomingMessage" ).slideToggle( 600, function() {
        // Animation complete.
    });

    $( "#userInput" ).slideToggle( 600, function() {
        // Animation complete.
    });

    $('#folder i').toggle("slow", ()=>{})
    
    if($('#theTerminal').hasClass('statusFolded'))
        $('#theTerminal.statusFolded').removeClass('statusFolded')
    else
        $('#theTerminal').addClass('statusFolded')
});
