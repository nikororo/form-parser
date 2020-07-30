const inputFile = document.getElementById("inputJsonFile");
const form = document.getElementById("form");

const inputType = {
    file: "multiple",
    email: "multiple"
}


function Parser(jsonFile) {
    let reader = new FileReader();
    let json;

    reader.readAsText(jsonFile);
    reader.onload = function() {
        json = reader.result;
        createTitle(JSON.parse(json));
    };
}

function createTitle(content) {
    form.innerHTML = "";
    let title = document.createElement('h1');
    let name = content.name;

    name = name[0].toUpperCase() + name.slice(1);
    name = name.replace(/_/g, " ");
    
    title.innerHTML = name;
    form.appendChild(title);

    createForm(content);
}

function createForm(content) {
    Object.keys(content).map(a => {
        switch (a) {
            case "fields":
                createFields(content[a]);
                break;
            case "references":
                createRefs(content[a]);
                break;
            case "buttons": 
                createButtons(content[a]);
                break;
        }
    });
}

function createFields (fields) {
    let id = 0;

    fields.map(obj => {
        let {label, input} = obj;
        let oneField;

        if (label) {
            oneField = document.createElement('label');
            oneField.setAttribute('for', id);
            oneField.innerHTML = label;
            form.appendChild(oneField);
        }

        if (input) {
            oneField = createInput(input, id);
            form.appendChild(oneField);
        }
        id++;
    });
}

function createInput(input, id) {
    if (input.multiple && !(inputType[input.type]==="multiple")) {
        delete input.type;
        return createSelect(input, id);
    }  

    if (input.type === "textarea") {
        delete input.type;
        return createTextarea(input, id);

    } else if (input.type === "file") {
        return createInputFile(input, id);
    }

    let inputField = document.createElement('input');
    inputField.setAttribute('id', id);

    for (let attribute in input) {
        
        if (Array.isArray(input[attribute])) {
            inputField.setAttribute('list', attribute);
            createDataList(attribute, input[attribute]);

        } else if (attribute === 'mask') {
            //накладывать маску
            
        } else if (input[attribute] === true) inputField.setAttribute(attribute, '');
        else inputField.setAttribute(`${attribute}`, input[attribute]);
    }
    return inputField;

}

function createInputFile(input, id) {
    let inputFileField = document.createElement('input');
    inputFileField.setAttribute('id', id);

    for (let attribute in input) {
        
        if (attribute === "filetype") {
            let strAccept = "";
            input[attribute].map(type => strAccept += "." + type + ", ");
            inputFileField.setAttribute('accept', strAccept.slice(0, -2));

        } else if (input[attribute] === true) inputFileField.setAttribute(attribute, '');
        else inputFileField.setAttribute(`${attribute}`, input[attribute]);
    }
    return inputFileField;

}

function createSelect(input, id) {
    let selectField = document.createElement('select');
    selectField.setAttribute('id', id);

    for (let attribute in input) {

        if (Array.isArray(input[attribute])) {
            input[attribute].map(opt => {
                let option = document.createElement('option');
                option.setAttribute('value', opt);
                option.innerHTML = opt;
                selectField.appendChild(option);
            });

        } else if (input[attribute] === true) selectField.setAttribute(attribute, '');
        else selectField.setAttribute(`${attribute}`, input[attribute]);
    }
    return selectField;
}

function createTextarea(input, id) {
    let textField = document.createElement('textarea');
    textField.setAttribute('id', id);
    for (let attribute in input) {
        
        if (input[attribute] === true) textField.setAttribute(attribute, '');
        else textField.setAttribute(`${attribute}`, input[attribute]);
    }
    return textField;
}

function createDataList(attribute, options) {
    let dataList = document.createElement('datalist');
    dataList.setAttribute('id', attribute);
    form.appendChild(dataList);

    options.map (value => {
        let option = document.createElement('option');
        option.setAttribute('value', value);
        dataList.appendChild(option);
    });
}

function createRefs(refs) {
    //выводить ссылки
}

function createButtons(buttons) {
    buttons.map(but => {
        let buttonTag = document.createElement('button');
        buttonTag.innerHTML = but.text;
        form.appendChild(buttonTag);
    });
}

inputFile.addEventListener("change", () => Parser(inputFile.files[0]));