const BASE_URL = "http://127.0.0.1:5000/api";

// create cupcake div html items
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
	// todo src not showing up, spaces between "/" characters
}

// loop across db cupcakes
async function genegrateAllCupcakes() {
	const resp = await axios.get(`${BASE_URL}/cupcakes`);
	for (let cupcakeData of resp.data.cupcakes) {
		let newCupcake = $(generateCupcakesHTML(cupcakeData));
		$("#cupcakes").append(newCupcake);
	}
}

// submit new cupcake
$("#new-cupcake-form").on("submit", async function (event) {
	event.preventDefault();

	// select all variables
	let flavor = $("#flavor").val();
	let size = $("#size").val();
	let rating = $("#rating").val();
	let image = $("#image").val();
	let csrf_token = $("#csrf_token").val();

	const newCupcakeResponse = await axios.post(`${BASE_URL}/cupcakes`, {
		flavor,
		size,
		rating,
		image,
		csrf_token,
	});

	let newCupcake = $(generateCupcakesHTML(newCupcakeResponse.data.cupcake));
	$("#cupcakes").append(newCupcake);
	$("#new-cupcake-form").trigger("reset");
});

// search cupcake flavors
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

// delete li & db object
$("#cupcakes").on("click", "button", async function (evt) {
	let itemId = $(this).closest("div").attr("data-cupcake-id");

	let response = await axios.delete(`${BASE_URL}/cupcakes/${itemId}`);

	$(this).closest("div").remove();
});

$("#cupcakes").on("click", "div", async function (evt) {
	let itemId = $(this).closest("div").attr("data-cupcake-id");
	console.log(itemId);

	if ($("#edit-cupcake").is("[hidden]")) {
		// show form and lable
		$("#edit-cupcake").removeAttr("hidden");
		$("#edit-cupcake-form").removeAttr("hidden");

		// get data about selected item
		let response = await axios.get(`${BASE_URL}/cupcakes/${itemId}`);
		updateEditForm(response);
		submit_edit_form_to_API(itemId);
		// else hide form
	} else {
		$("#edit-cupcake").attr("hidden", "");
		$("#edit-cupcake-form").attr("hidden", "");
	}

	// $(this).closest("div").remove();
	// $("#cupcakes").append(response);
});

// obtain current data and pre-ill edit form
function updateEditForm(cupcake) {
	let flavor = cupcake.data.cupcake.flavor;
	let size = cupcake.data.cupcake.size;
	let upperSize = toUpperCase(size);
	let rating = cupcake.data.cupcake.rating;
	let image = cupcake.data.cupcake.image;

	$("#editFlavor").val(flavor);
	$("#editSize").attr(size);
	$("#editRating").val(rating);
	$("#editImage").val(image);
}

// submit edited cupcake
function submit_edit_form_to_API(itemId) {
	$("#edit-cupcake-form").on("submit", async function (event) {
		event.preventDefault();

		// select all variables
		let flavor = $("#editFlavor").val();
		let size = $("#editSize").val();
		let rating = $("#editRating").val();
		let image = $("#editImage").val();
		let csrf_token = $("#csrf_token").val();

		const newCupcakeResponse = await axios.patch(`${BASE_URL}/cupcakes/${itemId}`, {
			flavor,
			size,
			rating,
			image,
			csrf_token,
		});

		let newCupcake = $(generateCupcakesHTML(newCupcakeResponse.data.cupcake));

		$(`[data-cupcake-id="${itemId}"]`).closest("div").remove();
		// $("#cupcakes").find(`data-cupcake-id=${itemId}`).remove();

		$("#cupcakes").append(newCupcake);
		$("#new-cupcake-form").trigger("reset");
		$("#edit-cupcake").attr("hidden", "");
		$("#edit-cupcake-form").attr("hidden", "");
	});
}

function toUpperCase(word) {
	firstChar = word.substring(0, 1);
	upperf = firstChar.toUpperCase();

	tail = word.substring(1);
	upperWord = upperf + tail;
	return upperWord;
}

// load cupcakes on once page is ready
$(document).ready(genegrateAllCupcakes);
