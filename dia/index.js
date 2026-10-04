const SUPABASE_URL = 'https://pxodngysquyfzrhdiebt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PE-oQ-ZHUp3GjeNyCdYrLg_wAICfAyD';
let dbS = 'first_day'

let newRow = {
    category: 'Actividad',
    al_A_score: 0,
    al_B_score: 0,
    catMult: 1,
    observations: 'Nada'
};


const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

function updateTable() {
    loadScores();
}

async function loadScores() {
    const params = new URLSearchParams(window.location.search);

    for (const [key, value] of params) {
        if (key == 'db') {
            if (value == '2') {
                dbS = 'second_day'
            }
            else {
                dbS = 'first_day'
            }
        }
    }
    const { data, error } = await db
        .from(dbS)
        .select('*');
    if (error) {
        console.error(error);
        return;
    }
    console.log(data);
    data.sort((a, b) => {
        let i = 0;
        while (
            a.category[i] != 0 &&
            a.category[i] == b.category[i]
        ) {
            i++;
        }
        return a.category[i] - b.category[i];
    });

    let Ascore = 0;
    let Bscore = 0;

    for (let i = 0; i < data.length; i += 1) {
        Ascore += data[i].al_A_score * data[i].catMult;
        Bscore += data[i].al_B_score * data[i].catMult;
    }

    console.log(`Scores: A=${Ascore} | B=${Bscore}`);

    newRow = {
        category: 'Actividad',
        al_A_score: 0,
        al_B_score: 0,
        catMult: 1,
        observations: 'Nada'
    };

    let tableHTML = `
        <table style="width:100%">
            <thead>
                <tr>
                    <th>Categoria/Actividad</th>
                    <th>Puntaje Alianza A</th>
                    <th>Puntaje Alianza B</th>
                    <th>Multiplicador de puntos</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < data.length; i += 1) {
        tableHTML += `
            <tr>
                <td data-label="Categoria/Actividad">
                    <p class="pointsClass">${data[i].category}</p>
                </td>
                <td data-label="Puntaje Alianza A">
                    <p class="pointsClass">${data[i].al_A_score}</p>
                </td>
                <td data-label="Puntaje Alianza B">
                    <p class="pointsClass">${data[i].al_B_score}</p>

                </td>
                <td data-label="Multiplicador">
                    <p class="pointsClass">${data[i].catMult}</p>

                </td>
                <td data-label="Observaciones">
                    <p class="pointsClass">${data[i].observations}</p>
                </td>
            </tr>
        `;
    }

    tableHTML += `
            <tr >
                <td data-label="Categoria/Actividad">
                    <p class="pointsClass">Totales!</p>
                </td>
                <td data-label="Puntaje Alianza A">
                    <p class="pointsClass">${Ascore}</p>
                </td>
                <td data-label="Puntaje Alianza B">
                    <p class="pointsClass">${Bscore}</p>
                </td>
                <td data-label="Multiplicador">
                    <p class="pointsClass">Totales!</p>
                </td>
                <td data-label="Observaciones">
                    <p class="pointsClass">Totales!</p>
                </td>
            </tr>




            </tbody>
        </table>
    `;
    document.getElementsByClassName("table")[0].innerHTML = tableHTML;
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
}