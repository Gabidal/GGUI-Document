const Headers = [ 
    "Title name 1",
]

function Generate_List(){
    const List = document.getElementById("menu")
    const Main = document.getElementById("main")

    for (const Header of Headers){
        const Item = document.createElement("li")
        Item.className = "Element"
        Item.onclick = () => { 
            Goto(Header)
            for (const I of List.getElementsByTagName("li")){
                I.style.backgroundColor = "rgba(255, 255, 255, 0)"
            }
            Item.style.backgroundColor = "rgba(255, 255, 255, 0.255)"
        }
        Item.innerHTML = Header
        
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