function decodeMessage() {

    const input =
        document.getElementById("decodeImage");

    const result =
        document.getElementById("decodeResult");

    const file = input.files[0];

    if (!file) {

        result.textContent =
            "Please upload a stego image.";

        result.className =
            "message error";

        result.style.display =
            "block";

        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        const img = new Image();

        img.onload = function() {

            const canvas =
                document.createElement("canvas");

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx =
                canvas.getContext("2d");

            ctx.drawImage(img, 0, 0);

            const imageData =
                ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            const data =
                imageData.data;

            let bits = "";
            let message = "";

            for (let i = 0; i < data.length; i += 4) {

                for (let channel = 0; channel < 3; channel++) {

                    bits +=
                        data[i + channel] & 1;

                    if (bits.length === 8) {

                        const charCode =
                            parseInt(bits, 2);

                        message +=
                            String.fromCharCode(charCode);

                        bits = "";

                        if (
                            message.endsWith("###END###")
                        ) {

                            message =
                                message.replace(
                                    "###END###",
                                    ""
                                );

                            result.textContent =
                                "Hidden Message: " +
                                message;

                            result.className =
                                "message";

                            result.style.display =
                                "block";

                            return;
                        }

                    }

                }

            }

            result.textContent =
                "No hidden message was found.";

            result.className =
                "message error";

            result.style.display =
                "block";

        };

        img.src =
            event.target.result;

    };

    reader.readAsDataURL(file);
}