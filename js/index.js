const inputFile = document.getElementById("inputJsonFile");
const form = document.getElementById("form");

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

    delete content.name;

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
        }
        
    });
}

function createFields (fields) {

    fields.map(obj => {
        let {label, input} = obj;

        let oneField;
        if (label) {
            oneField = document.createElement('label');
            oneField.innerHTML = label;
            form.appendChild(oneField);
        }
        if (input) {
            oneField = document.createElement('input');
            
            for (let attribute in input) {
                
                if (Array.isArray(input[attribute])) {
                    oneField.setAttribute('list', attribute);
                    createDataList(attribute, input[attribute]);

                } else if (attribute === 'mask') {

                    console.log('mask');
                    
                } else if (input[attribute] === true) oneField.setAttribute(attribute, '');
                else oneField.setAttribute(`${attribute}`, input[attribute]);

                form.appendChild(oneField);
            }
        }
    });
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



inputFile.addEventListener("change", () => Parser(inputFile.files[0]));