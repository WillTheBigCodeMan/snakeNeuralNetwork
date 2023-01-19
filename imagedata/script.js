const $ = id => document.getElementById(id);

const fileInput = $("fileInput");
const btnRead = $("btnRead");
const rdoText = $("rdoText");
const contentsDiv = $("contents");

const fileTest = new File(["data1"], "data1");

const updateButton = () => {
    btnRead.disabled = fileInput.files.length === 0;
};

const readTextFile = async (file) => {
    const text = await file.text();
    contentsDiv.textContent = text;
    contentsDiv.classList.add("text");
    contentsDiv.classList.remove("binary");
    console.log("Done reading text file");
};

const readBinaryFile = async (file) => {
    // Read into an array buffer, create
    const buffer = await file.arrayBuffer();
    console.log(buffer);
    // Get a byte array for that buffer
    const bytes = new Uint8Array(buffer);
    // Show it as hex text
    const lines = [];
    let line = [];
    bytes.forEach((byte, index) => {
        const hex = byte.toString(16).padStart(2, "0");
        line.push(hex);
        if (index % 28 === 27) {
            lines.push(line.join(" "));
            line = [];
        }
    });
    console.log(lines);
};

updateButton();

fileInput.addEventListener("input", updateButton);

btnRead.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (!file) {
        return;
    }
    const readFile = rdoText.checked ? readTextFile : readBinaryFile;
    readFile(fileInput.files[0])
    .catch(error => {
        console.error(`Error reading file:`, error);
    });
});