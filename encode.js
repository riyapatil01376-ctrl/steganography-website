function encodeMessage() {

    const imageInput = document.getElementById("imageInput");
    const messageInput = document.getElementById("secretMessage");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");
    const messageBox = document.getElementById("messageBox");
    const downloadBtn = document.getElementById("downloadBtn");

    const file = imageInput.files[0];
    const message = messageInput.value;

    if (!file) {
        showMessage("Please select an image first.", true);
        return;
    }

    if (!message.trim()) {
        showMessage("Please enter a secret message.", true);
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        const img = new Image();

        img.onload = function() {

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const data = imageData.data;

            const encodedMessage =
                message + "###END###";

            const binary = [];

            for (let i = 0; i < encodedMessage.length; i++) {

                const charCode =
                    encodedMessage.charCodeAt(i);

                for (let bit = 7; bit >= 0; bit--) {

                    binary.push(
                        (charCode >> bit) & 1
                    );

                }

            }

            if (binary.length > data.length / 4 * 3) {

                showMessage(
                    "Message is too large for this image.",
                    true
                );

                return;
            }

            let bitIndex = 0;

            for (let i = 0; i < data.length; i += 4) {

                for (let channel = 0; channel < 3; channel++) {

                    if (bitIndex < binary.length) {

                        data[i + channel] =
                            (data[i + channel] & 254) |
                            binary[bitIndex];

                        bitIndex++;

                    }

                }

            }

            ctx.putImageData(imageData, 0, 0);

            const result =
                canvas.toDataURL("image/png");

            preview.src = result;
            preview.style.display = "block";

            downloadBtn.href = result;
            downloadBtn.download = "stegosecure-image.png";
            downloadBtn.style.display = "inline-block";

            showMessage(
                "Success! Your secret message has been hidden in the image.",
                false
            );

        };

        img.src = event.target.result;

    };

    reader.readAsDataURL(file);
}


function showMessage(text, isError) {

    const messageBox =
        document.getElementById("messageBox");

    messageBox.textContent = text;

    messageBox.style.display = "block";

    if (isError) {

        messageBox.classList.add("error");

    } else {

        messageBox.classList.remove("error");

    }

}