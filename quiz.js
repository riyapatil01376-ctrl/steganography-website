function checkQuiz() {

    const answers = {
        q1: "a",
        q2: "a",
        q3: "c",
        q4: "a",
        q5: "a"
    };

    let score = 0;

    for (let question in answers) {

        const selected =
            document.querySelector(
                `input[name="${question}"]:checked`
            );

        if (selected &&
            selected.value === answers[question]) {

            score++;

        }

    }

    document.getElementById("result").textContent =
        "Your Score: " + score + " / 5";

}