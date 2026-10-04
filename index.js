const SUPABASE_URL = 'https://pxodngysquyfzrhdiebt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PE-oQ-ZHUp3GjeNyCdYrLg_wAICfAyD';


let tableHTML = ``;
const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


function updateTable() {
    loadScores();
}

async function loadScores() {
    
    const { data, error } = await db
        .from('first_day')
        .select('*');
    if (error) {
        console.error(error);
        return;
    }

    let Ascore = 0;
    let Bscore = 0;

    for (let i = 0; i < data.length; i += 1) {
        Ascore += data[i].al_A_score * data[i].catMult;
        Bscore += data[i].al_B_score * data[i].catMult;
    }
    


    tableHTML = `
        <table style="width:100%">
            <thead>
                <tr>
                    <th>Dia</th>
                    <th>Puntaje Alianza A</th>
                    <th>Puntaje Alianza B</th>
                </tr>
            </thead>
        <tbody>
        <tr>
            <td data-label="Categoria/Actividad">
                <p class="pointsClass">Dia 1</p>
            </td>
            <td data-label="Puntaje Alianza A">
                <p class="pointsClass">${Ascore}</p>
            </td>
            <td data-label="Puntaje Alianza B">
                <p class="pointsClass">${Bscore}</p>
            </td>
        </tr>
        `;

    const {data: dat2, error: err2} = await db
        .from('second_day')
        .select('*');
    console.log(dat2);
    if (err2) {
        console.error(err2);
        return;
    }
    let Ascore2 = 0, Bscore2 = 0;
    for (let i = 0; i < dat2.length; i += 1) {
        
        Ascore2 += dat2[i].al_A_score * dat2[i].catMult;
        Bscore2 += dat2[i].al_B_score * dat2[i].catMult;
    }
    Ascore += Ascore2;
    Bscore += Bscore2;

    tableHTML += `
        <tr>
            <td data-label="Categoria/Actividad">
                <p class="pointsClass">Dia 2</p>
            </td>
            <td data-label="Puntaje Alianza A">
                <p class="pointsClass">${Ascore2}</p>
            </td>
            <td data-label="Puntaje Alianza B">
                <p class="pointsClass">${Bscore2}</p>
            </td>
        </tr>
        `;

    Ascore2 = 0, Bscore2 = 0;
    const { data: data3, error: error3 } = await db
        .from('hidden')
        .select('*');
    if (error3) {
        console.error(error3);
        return;
    }
    for (let i = 0; i < data3.length; i += 1) {
        Ascore2 += data3[i].al_A_score * data3[i].catMult;
        Bscore2 += data3[i].al_B_score * data3[i].catMult;
    }
    Ascore += Ascore2;
    Bscore += Bscore2;

    tableHTML += `
            <tr>
                <td data-label="Categoria/Actividad">
                    <p class="pointsClass">Totales!</p>
                </td>
                <td data-label="Puntaje Alianza A">
                    <p class="pointsClass">${Ascore}</p>
                </td>
                <td data-label="Puntaje Alianza B">
                    <p class="pointsClass">${Bscore}</p>
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