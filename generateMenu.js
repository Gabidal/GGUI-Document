let Headers = { 
    "concepts": [
        "color",
        "utf",
        "fileStream",
        "logger",
        "smallTypes"
    ]
}

let HeaderTranslations = {
    "color": [
        "RGB",
        "RGBA"
    ],
    "utf": [
        "Compact String",
        "Compact_String",
        "Super String",
        "Super_String"
    ],
    "fileStream": [
        "CMD",
        "filePosition",
        "bufferCapture"
    ],
    "logger": [
        "report",
        "reportStack",
        "report Stack"
    ],
    "smallTypes": [
        "FVector2",
        "FVector3",
        "IVector2",
        "IVector3",
        "Event",
        "Input",
        "Action",
        "EventHandler",
        "Memory",
        "STAIN",
        "Stain",
        "Dirty",
        "Guard",
        "Atomic"
    ]
}

function Reverse(dict){
    var reversed = {}
    for (const [Header, Content] of Object.entries(dict)){
        reversed[Header] = Content.reverse()
    }
    return reversed
}

const Header_Backup = Reverse(structuredClone(Headers))

function Generate_List(){
    const List = document.getElementById("menu")

    if (!List)
        return
    
    for (const [Header, Content] of Object.entries(Headers)){
        const Item = document.createElement("details")
        Item.className = "Header List Element"
        Item.open = true; // Make the details open by default

        // Set the title as an summary tag as the first element:
        const Summary = document.createElement("summary")
        Summary.innerText = Header
        Item.appendChild(Summary)

        // now add the content to the item
        for (const Sub_Item of Content){
            const Sub_Element = document.createElement("li")
            Sub_Element.innerText = Sub_Item
            Sub_Element.onclick = () => { 
                // Automatically scroll to the actual paragraph title.
                Goto(Header, Sub_Item)

                // go through the paragraph titles and set temporarily the background to a lighter tone. 
                // for (const I of List.getElementsByTagName("li")){
                //     I.style.backgroundColor = "rgba(255, 255, 255, 0)"
                // }
                // Sub_Element.style.backgroundColor = "rgba(255, 255, 255, 0.255)"
            }
            Item.appendChild(Sub_Element)
        }
        
        // check if the list already has an item named in the summary like this one which is about to be inserted, if there already is one, then replace only its child and keep the open attribute on the detail
        let Found_Previous_Item_Form = false
        for (const Old_Item of List.getElementsByTagName("details")){
            if (Old_Item.getElementsByTagName("summary")[0].innerText === Header){
                
                // clear
                for (let i = Old_Item.childNodes.length - 1; i >= 0; i--){
                    Old_Item.childNodes[i].remove()
                }

                for (let i = Item.childNodes.length - 1; i >= 0; i--){

                    Old_Item.appendChild(Item.childNodes[i])

                }

                Found_Previous_Item_Form = true
                break
            }
        }

        if (!Found_Previous_Item_Form){
            List.appendChild(Item)
        }

    }
}

function Get_By_Class(Parent, Class_Name){
    // Goes through recursively through all the children of the Parent and compiles an list of elements with that specific class name.
    // Note the element can contain more than one class name
    var Elements = []
    for (const Child of Parent.children){
        if (Child.className.includes(Class_Name)){
            Elements.push(Child)
        }
        Elements = Elements.concat(Get_By_Class(Child, Class_Name))
    }
    return Elements
}

function Goto(theme, Title_Name){
    fetch(theme + "/" + Title_Name + '.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('content-container').innerHTML = html;
        Highlight_Links()
        hljs.highlightAll();
    });
}

// if the parameter is false, then return the order back to what it was, which is stored in the spare variable: Header_Backup
function Change_Order(alphabetical){
    if (alphabetical){
        for (const Header in Headers){
            // needs to be reverse, since the move operation is done reversely
            Headers[Header] = Headers[Header].sort().reverse()
        }
    } else {
        Headers = structuredClone(Header_Backup)
    }

    // Generate the list again
    Generate_List()
}

function Highlight_Links(){
    // goes through the paragraphs and turns them into a clickable links which would then use the 'Goto()' function with he name of the link
    const Main = document.getElementById("content-container")
    for (const Paragraph of Main.getElementsByTagName("p")){
        let Name = Paragraph.innerText

        // concatenate the string into words:
        let words = Name.split(/(\s|[.,!?(){}[\]])+/)

        // go through each word, if the current word appears in the Headers map, then make it a link element
        for (let i = 0; i < words.length; i++){
            for (const [key, value] of Object.entries(Headers)) {
                if (value.includes(words[i])) {
                    words[i] = `<a class="Link" onclick="Goto('${key}', '${words[i]}')">${words[i]}</a>`;
                } else {
                    for (const [transKey, transValues] of Object.entries(HeaderTranslations)) {
                        if (transValues.includes(words[i])) {
                            words[i] = `<a class="Link" onclick="Goto('${key}', '${transKey}')">${words[i]}</a>`;
                        }
                    }
                }
            }
        }

        // transform the list back into a string
        Name = words.join("")

        // set the paragraph innerHTML to the new string
        Paragraph.innerHTML = Name
    }
}

function display_menu(){
    fetch('menu.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('menu-container').innerHTML = html;
        // Change_Order(true)
        Generate_List()
    });
}

function dev_display(file){
    fetch(file + '.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('content-container').innerHTML = html;
        Generate_List()
        Highlight_Links()
        hljs.highlightAll();
    });
}
