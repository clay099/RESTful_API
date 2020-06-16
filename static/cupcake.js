const BASE_URL = "http://127.0.0.1:5000/api";

function generateCupcakesHTML(cupcake) {
	return `
    <div data-cupcake-id=${cupcake.id}>
        <li>
        ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
        <button class="delete-button btn btn-sm btn-danger">X</button>
        </li>
        <img class="cupcake-img>
            src="${cupcake.image}"
            alt="issue loading: ${cupcake.image}"
            // alt="no image provided"
    </div>
    `;
}

async function genegrateAllCupcakes() {
	const resp = await axios.get(`${BASE_URL}/cupcakes`);
	for (let cupcakeData of resp.data.cupcakes) {
		let newCupcake = $(generateCupcakesHTML(cupcakeData));
		$("#cupcakes").append(newCupcake);
	}
}

$("#new-cupcake-form").on("submit", async function (event) {
	event.preventDefault();

	let flavor = $("#flavor").val();
	let size = $("#size").val();
	let rating = $("#rating").val();
	let image = $("#image").val();

	const newCupcakeResponse = await axios.post(`${BASE_URL}/cupcakes`, {
		flavor,
		size,
		rating,
		image,
	});

	let newCupcake = $(generateCupcakesHTML(newCupcakeResponse.data.cupcake));
	$("#cupcakes").append(newCupcake);
	$("#new-cupcake-form").trigger("reset");
});

$("#search-cupcake-form").on("submit", async function (evt) {
	evt.preventDefault();

	let flavor = $("#flavor").val();

	const returnedCupcakes = await axios.get(`${BASE_URL}/cupcakes/search`, { flavor });

	for (let cupcakeData of returnedCupcakes.data.cupcakes) {
		let newCupcake = $(generateCupcakesHTML(cupcakeData));
		$("#cupcakes").empty();
		$("#cupcakes").append(newCupcake);
	}
});

$(document).ready(genegrateAllCupcakes);
