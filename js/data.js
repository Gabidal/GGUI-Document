// Data: headers and translations
export const Headers = {
    Tutorials: ["Getting Started"],
    Styling: ["Styling", "Position", "Dimensions", "Borders"],
    Concepts: [
        "Color",
        "UTF",
        "File Stream",
        "Logger",
        "Small Types",
        "Lifetime",
        "Sprite",
        "Arguments"
    ],
    Examples: [
        "Button Example",
        "Canvas Example",
        "ListView Example",
        "Opacity Example",
        "ProgressBar Example",
        "ScrollView Example",
        "SwitchBox Example",
        "TextField Example"
    ],
    Versions: ["0.1.8"]
};

export const HeaderTranslations = {
    Color: ["RGB", "RGBA", "opacity", "transparency"],
    UTF: ["Compact String", "Compact_String", "Super String", "Super_String"],
    "File Stream": ["CMD", "filePosition", "bufferCapture"],
    Logger: ["report", "reportStack", "report Stack"],
    "Small Types": [
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
    ],
    Styling: ["style", "style base", "style_base"],
    Lifetime: ["Exit", "Crash", "ctrl+c", "Init", "GGUI::GGUI", "initGGUI"],
    Borders: ["enable_border", "enable border", "Space Optimization"],
    Sprite: ["Multi Frame", "Animated"],
    "0.1.8": ["The Styling update", "Styling update"],
    Position: ["x", "X", "y", "Y", "z", "Z"],
    Dimensions: ["width", "height", "dimensions", "dimension"],
    Example: ["examples"]
};

export const clone = (obj) => JSON.parse(JSON.stringify(obj));
export const reverseLists = (dict) => Object.fromEntries(
    Object.entries(dict).map(([k, v]) => [k, [...v].reverse()])
);
