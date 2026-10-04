const SUPABASE_URL = 'https://pxodngysquyfzrhdiebt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PE-oQ-ZHUp3GjeNyCdYrLg_wAICfAyD';

let newRow = {
    category: 'Actividad',
    al_A_score: 0,
    al_B_score: 0,
    catMult: 1,
    observations: 'Nada'
};

let dbS = 'first_day'

let frameOrigin;
const params = new URLSearchParams(window.location.search);

for (const [key, value] of params) {
    if (key == 'db') {
        if (value == '2') {
            dbS = 'second_day'
        }
        else if (value == '1758508030') {
            dbS = 'hidden'
        }
        else {
            dbS = 'first_day'
        }
    }
}

window.addEventListener('message', async (event) => {
    if (event.data?.origin != frameOrigin) {
        if(event.data.type == 'dont-remove-all-scores') {
            document.body.getElementsByClassName("popup")[0].animate([{
                top: '50%',
            },{
                top: 0
            }
            ], {
                duration: 500,
                direction: "alternate",
                easing: "ease-out"
            });
            await new Promise(r => setTimeout(r, 500));
            document.body.getElementsByClassName("popup")[0].remove();

        }
        if(event.data.type == 'remove-all-scores') {
            document.body.getElementsByClassName("popup")[0].animate([{
                top: '50%',
            },{
                top: 0
            }
            ], {
                duration: 500,
                direction: "alternate",
                easing: "ease-out"
            });
            await new Promise(r => setTimeout(r, 500));
            document.body.getElementsByClassName("popup")[0].remove();
            await removeAll();
            await loadScores();

        }
    };

});

async function removeAll() {
    const { error } = await db
        .from(dbS)
        .delete()
        .not('category', 'is', null);

    if (error) {
        console.error(error);
    } 
    else {
        console.log('Rows deleted');
    }
}

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

function updateTable() {
    loadScores();
}

async function loadScores() {
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < data.length; i += 1) {
        tableHTML += `
            <tr>
                <td data-label="Categoria/Actividad">
                    <input
                        type="text"
                        value="${data[i].category}"
                        onchange="setCategory('${data[i].category}', this.value)"
                    >
                </td>
                <td data-label="Puntaje Alianza A">
                    <input
                        type="number"
                        value="${data[i].al_A_score}"
                        onchange="setAllianceAScore('${data[i].category}', this.value)"
                    >
                </td>
                <td data-label="Puntaje Alianza B">
                    <input
                        type="number"
                        value="${data[i].al_B_score}"
                        onchange="setAllianceBScore('${data[i].category}', this.value)"
                    >
                </td>
                <td data-label="Multiplicador">
                    <input
                        type="number"
                        value="${data[i].catMult}"
                        onchange="setCategoryMult('${data[i].category}', this.value)"
                    >
                </td>
                <td data-label="Observaciones">
                    <input
                        type="text"
                        value="${data[i].observations}"
                        onchange="setCategoryObservations('${data[i].category}', this.value)"
                    >
                </td>
                <td data-label="">
                    <button onclick="removeCategory('${data[i].category}')">
                        X
                    </button>
                </td>
            </tr>
        `;
    }

    tableHTML += `
            <tr >
                <td data-label="Categoria/Actividad">
                    <p class="totalesClass">Totales!</p>
                </td>
                <td data-label="Puntaje Alianza A">
                    <p class="totalesClass">${Ascore}</p>
                </td>
                <td data-label="Puntaje Alianza B">
                    <p class="totalesClass">${Bscore}</p>
                </td>
                <td data-label="Multiplicador">
                    <p class="totalesClass">Totales!</p>
                </td>
                <td data-label="Observaciones">
                    <p class="totalesClass">Totales!</p>
                </td>
                <td data-label="">
                    <button onclick="reset()">
                        X
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <table style="width:100%" class="newRow">
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
                <tr>
                    <td data-label="Categoria/Actividad">
                        <input
                            type="text"
                            value="Actividad"
                            onchange="newRow.category = this.value"
                        >
                    </td>
                    <td data-label="Puntaje Alianza A">
                        <input
                            type="number"
                            value="0"
                            onchange="newRow.al_A_score = this.value"
                        >
                    </td>
                    <td data-label="Puntaje Alianza B">
                        <input
                            type="number"
                            value="0"
                            onchange="newRow.al_B_score = this.value"
                        >
                    </td>
                    <td data-label="Multiplicador">
                        <input
                            type="number"
                            value="1"
                            onchange="newRow.catMult = this.value"
                        >
                    </td>
                    <td data-label="Observaciones">
                        <input
                            type="text"
                            value="Nada"
                            onchange="newRow.observations = this.value"
                        >
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="addRowBtn" onclick="addCategory()">Añadir nuevo puntaje</button>
    `;
    document.getElementsByClassName("table")[0].innerHTML = tableHTML;
}

async function setAllianceAScore(category, score) {
    const { error } = await db
        .from(dbS)
        .update({
            al_A_score: score
        })

        .eq('category', category);

    if (error) {
        console.error(error);
    }
}

async function setAllianceBScore(category, score) {
    const { error } = await db
        .from(dbS)
        .update({
            al_B_score: score
        })

        .eq('category', category);

    if (error) {
        console.error(error);
    }
}

async function setCategoryObservations(category, obs) {
    const { error } = await db
        .from(dbS)
        .update({
            observations: obs
        })

        .eq('category', category);

    if (error) {
        console.error(error);
    }
}

async function removeCategory(category) {
    const { error } = await db
        .from(dbS)
        .delete()
        .eq('category', category);
    if (error) {
        console.error(error);
    }
    loadScores();
}

async function setCategoryMult(category, mult) {
    const { error } = await db
        .from(dbS)
        .update({
            catMult: mult
        })

        .eq('category', category);

    if (error) {
        console.error(error);
    }
}

async function setCategory(cat, newCat) {
    const { error } = await db
        .from(dbS)
        .update({
            category: newCat
        })

        .eq('category', cat);

    if (error) {
        console.error(error);
    }
    await loadScores();
}

async function addCategory() {
    const { error } = await db
        .from(dbS)
        .insert({
            category: newRow.category,
            al_A_score: newRow.al_A_score,
            al_B_score: newRow.al_B_score,
            observations: newRow.observations,
            catMult: newRow.catMult
        });

    if (error) {
        console.error(error);
        return;
    }
    loadScores();
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

function reset() {
    const isDark = document.body.classList.contains("dark");
    if (document.body.getElementsByClassName("popup").length > 0) {
        return;
    }

    htmData = document.body.innerHTML
    document.body.innerHTML = `<iframe class="popup" src="./popup/index.htm?t=${isDark ? "dark" : ""}" />`
    document.body.innerHTML += htmData;
    const frame = document.querySelector('.popup');
    frameOrigin = new URL(frame.src, window.location.href).origin;
    document.body.getElementsByClassName("popup")[0].animate([
        {
            top: 0,
        },

        {
            top: '50%'
        }

    ], {
        duration: 500,
        direction: "alternate",
        easing: "ease-out"
    }
    );

}
