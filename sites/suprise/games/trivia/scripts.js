let currentQuestionIndex = 0;
let score = 0;

// Reference to the audio element
const music = document.getElementById('thinking-music');

// Initialize music state based on localStorage
const isMusicPlaying = localStorage.getItem('isMusicPlaying') === 'true';

const quizData = [
    {
        question: "What is the Wanderer's Elemental Skill?",
        options: ["Wind Favored Blade", "Hanega: Song of the Wind", "Kusanagi Slash", "Raging Tempest"],
        answer: "Hanega: Song of the Wind"
    },
    {
        question: "Which weapon type does the Wanderer use?",
        options: ["Sword", "Claymore", "Bow", "Catalyst"],
        answer: "Catalyst"
    },
    {
        question: "Where was the Wanderer originally created?",
        options: ["Mondstadt", "Liyue", "Inazuma", "Sumeru"],
        answer: "Inazuma"
    },
    {
        question: "What is the Wanderer's Constellation name?",
        options: ["Peregrinus", "Agnidus", "Praxis", "Mare Liberum"],
        answer: "Peregrinus"
    },
    {
        question: "What lesson did Nahida hope the Wanderer would learn through their interactions?",
        options: ["The importance of power and strength", "The value of human connections and self-forgiveness", "How to manipulate the dreams of others", "The necessity of vengeance against those who wronged him"],
        answer: "The value of human connections and self-forgiveness"
    },
    {
        question: "What is the cooldown time of Wanderer's Elemental Burst?",
        options: ["10 seconds", "15 seconds", "20 seconds", "12 seconds"],
        answer: "15 seconds"
    },
    {
        question: "Which artifact set is considered best-in-slot for the Wanderer?",
        options: ["Shimenawa's Reminiscence", "Echoes of an Offering", "Viridescent Venerer", "Emblem of Severed Fate"],
        answer: "Shimenawa's Reminiscence"
    },
    {
        question: "What unique ability does the Wanderer gain from his Elemental Skill?",
        options: ["Flight in mid-air", "Increased Elemental Mastery", "Elemental Skill resets cooldown", "Healing nearby allies"],
        answer: "Flight in mid-air"
    },
    // Added harder lore-based questions
    {
        question: "The Wanderer was previously known by which name before he took on the name 'Scaramouche'?",
        options: ["Kabukimono", "Kunikuzushi", "Sukunabikona", "Yasha"],
        answer: "Kunikuzushi"
    },
    {
        question: "What was Wanderer's role within the Fatui organization before he left?",
        options: ["An informant", "The 6th Harbinger", "A lieutenant", "The 11th Harbinger"],
        answer: "The 6th Harbinger"
    },
    {
        question: "Who originally created Wanderer as a prototype puppet?",
        options: ["Raiden Shogun", "Ei", "Yae Miko", "Nahida"],
        answer: "Ei"
    },
    {
        question: "Why was Wanderer abandoned by his creator before becoming 'Scaramouche'?",
        options: ["He was too powerful", "He cried upon awakening", "He failed his mission", "He lacked human emotions"],
        answer: "He cried upon awakening"
    },
    // Really hard questions
    {
        question: "Before becoming known as 'Scaramouche,' Wanderer was connected to which ancient Inazuman festival that is tied to his original name?",
        options: ["The Mikoshi Festival", "The Lantern Rite", "The Tatarasuna Swordsmithing Festival", "The Festival of the Irodori Flowers"],
        answer: "The Tatarasuna Swordsmithing Festival"
    },
    // Reaaaally hard questions
    {
        question: "Wanderer uses his Anemo powers to launch himself at an angle of 30° to the horizontal with an initial speed of 15 m/s. Ignoring air resistance, how far does he travel horizontally before landing?",
        options: [
            "18.75 meters",
            "19.98 meters",
            "28.98 meters",
            "30.27 meters"
        ],
        answer: "19.98 meters",
        links: [
            { text: "Projectile Motion Basics", url: "https://www.khanacademy.org/science/physics/two-dimensional-motion/projectile-motion/a/what-is-2d-projectile-motion" },
            { text: "LEIFIPhysik Waagrechter und schräger Wurf", url: "https://www.leifiphysik.de/mechanik/waagerechter-und-schraeger-wurf" }
        ]
    },
    {
        question: "What was the purpose of the Tatarasuna swordsmithing operation in which Wanderer was indirectly involved, and why was it ultimately halted?",
        options: ["To create weapons for the Shogunate's army; it was stopped due to internal conflicts", "To forge a special weapon for the Raiden Shogun; halted after mysterious deaths", "To smelt rare Inazuman ores; stopped due to environmental concerns", "To manufacture arms for resistance groups; ended after a fire outbreak"],
        answer: "To create weapons for the Shogunate's army; it was stopped due to internal conflicts"
    }
];

function startQuiz() {
    window.location.href = "quiz.html";
}

// Load each question
function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const linksElement = document.getElementById('links'); // Make sure there's an element in your HTML for links

    // Clear previous options and links
    optionsElement.innerHTML = '';
    linksElement.innerHTML = '';

    // Get current question data
    const currentQuestion = quizData[currentQuestionIndex];

    // Display question text
    questionElement.textContent = currentQuestion.question;

    // Create option buttons
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.onclick = () => checkAnswer(button, option); // Pass both button and option here
        optionsElement.appendChild(button);
    });

    // If there are links, display them
    if (currentQuestion.links) {
        currentQuestion.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = "_blank"; // Opens in a new tab
            linkElement.textContent = link.text;
            linksElement.appendChild(linkElement);
            linksElement.appendChild(document.createElement('br')); // Line break between links
        });
    }
}

function checkAnswer(button, selectedOption) {
    const currentQuestion = quizData[currentQuestionIndex];

    if (selectedOption === currentQuestion.answer) {
        score++;
        button.style.backgroundColor = "#a8e6a1";  // Correct answer (green)
    } else {
        button.style.backgroundColor = "#f8b4b4";  // Incorrect answer (red)
        Array.from(document.getElementsByClassName('option-btn')).forEach(btn => {
            if (btn.textContent === currentQuestion.answer) {
                btn.style.backgroundColor = "#a8e6a1";  // Show correct answer
            }
        });
    }

    // Disable all buttons after answering
    Array.from(document.getElementsByClassName('option-btn')).forEach(btn => {
        btn.disabled = true;
    });

    // Proceed to the next question after a delay
    setTimeout(() => nextQuestion(), 100);
}

// Play or pause music based on the saved state
if (isMusicPlaying) {
    music.play();
}

// Function to toggle music playback and store state in localStorage
function toggleMusic() {
    if (music.paused) {
        music.play();
        localStorage.setItem('isMusicPlaying', 'true'); // Store state
    } else {
        music.pause();
        localStorage.setItem('isMusicPlaying', 'false'); // Store state
    }
}

// Ensure music continues to play on page transitions
window.addEventListener("beforeunload", function() {
    if (!music.paused) {
        localStorage.setItem('isMusicPlaying', 'true');
    }
});

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function fadeOutQuiz() {
    document.getElementById('quiz-container').style.opacity = 0;
}

function fadeInQuiz() {
    document.getElementById('quiz-container').style.opacity = 1;
}

function endQuiz() {
    const totalQuestions = quizData.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    console.log(`Score: ${score}, Percentage: ${percentage}`); // Debugging output

    // Redirect to the results page with the score and percentage in the URL
    window.location.href = `results.html?score=${score}&percentage=${percentage}`;
}

window.onload = loadQuestion;
