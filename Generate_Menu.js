const Headers = { 
    "Namespaces": [
        "Symbols",
        "Time",
        "Constants",
        "Color",
        "UTF Flags",
        "Memory Flags",
        "Styles",
        "Flags",
        "State",
        "Settings"
    ],
    "Classes": [
        "Element"
    ]
}

function Generate_List(){
    const List = document.getElementById("menu")
    const Main = document.getElementById("main")

    for (const [Header, Content] of Object.entries(Headers)){
        const Item = document.createElement("details")
        Item.className = "Header List Element"

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
                Goto(Sub_Item)

                // go through the paragraph titles and set temporarily the background to a lighter tone. 
                for (const I of List.getElementsByTagName("li")){
                    I.style.backgroundColor = "rgba(255, 255, 255, 0)"
                }
                Sub_Element.style.backgroundColor = "rgba(255, 255, 255, 0.255)"
            }
            Item.appendChild(Sub_Element)
        }
        
        List.appendChild(Item)

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

function Goto(Title_Name){
    const Main = document.getElementById("main")

    var Element = document.getElementById(Title_Name)

    var All_Tittles = Get_By_Class(Main, "Tittle")

    // Clear the class name "Selected" from the title elements.
    for (const Tittle of All_Tittles){
        Tittle.className = "Tittle"
    }

    // Now set the Selected element the "Selected" class name.
    Element.className = "Tittle Selected"

    Main.scrollTo({behavior: "smooth", top: Element.offsetTop - 10})
}