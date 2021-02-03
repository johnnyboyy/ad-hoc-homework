const household = document.querySelector(".household");
const addButton = document.querySelector(".add");
const form = document.querySelector("form");
const debug = document.querySelector(".debug");
const elms = {
	age: document.querySelector("input[name='age']"),
	relationship: document.querySelector("select[name='rel']"),
	smoker: document.querySelector("input[name='smoker']"),
};

const getData = () => {
	return {
		age: Number(elms.age.value),
		relationship: elms.relationship.value,
		smoker: elms.smoker.checked,
	};
};

const createDataElement = ({ label, value }) => {
	const text = document.createTextNode(`${label}: ${value}`);
	const li = document.createElement("li");

	li.appendChild(text);

	return li;
};

const createDeleteButton = (parentElm) => {
	const button = document.createElement("button");
	const li = document.createElement("li");

	button.appendChild(document.createTextNode("Remove"));

	button.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();

		household.removeChild(parentElm);
	});

	li.appendChild(button);

	return li;
};

const createMember = ({ age, relationship, smoker }) => {
	const li = document.createElement("li");
	const ul = document.createElement("ul");

	ul.appendChild(createDataElement({ label: "age", value: age }));
	ul.appendChild(createDataElement({ label: "relationship", value: relationship }));
	ul.appendChild(createDataElement({ label: "smoker", value: smoker }));
	ul.appendChild(createDeleteButton(li));

	li.appendChild(ul);
	li.setAttribute("data-member", JSON.stringify({ age, relationship, smoker }));

	return li;
};

const createError = (message) => {
	const div = document.createElement("div");

	div.style.color = "red";
	div.appendChild(document.createTextNode(message));
	div.classList.add("errors");

	return div;
};

const displayErrors = (errors) => {
	errors.forEach(({ elm, message }) => {
		elm.parentNode.appendChild(createError(message));
	});
};

const clearErrors = () => {
	document.querySelectorAll(".errors").forEach((elm) => {
		elm.parentNode.removeChild(elm);
	});
};

const validate = ({ age, relationship }) => {
	const errors = [];

	if (typeof age !== "number" || age < 1) {
		errors.push({ elm: elms.age, message: "Age must be greater than 0" });
	}

	if (typeof relationship !== "string" || relationship === "") {
		errors.push({ elm: elms.relationship, message: "Relationship is required" });
	}

	return errors;
};

addButton.addEventListener("click", (event) => {
	event.preventDefault();
	event.stopPropagation();
	clearErrors();

	const data = getData();
	const errors = validate(data);

	if (errors.length) {
		displayErrors(errors);
	} else {
		const newMember = createMember(data);

		household.appendChild(newMember);

		form.reset();
	}
});

form.addEventListener("submit", (event) => {
	event.preventDefault();

	while (debug.firstChild) {
		debug.removeChild(debug.firstChild);
	}

	const data = Array.from(household.children).reduce((members, memberElm) => {
		const newMember = JSON.parse(memberElm.getAttribute("data-member"));

		return members.concat([newMember]);
	}, []);

	if (data.length < 1) {
		displayErrors([{ elm: document.getElementsByTagName("form")[0], message: "There's no data" }]);
	} else {
		// uncomment to see the data in the debug <pre>
		// debug.appendChild(document.createTextNode(JSON.stringify(data, null, 2)));
		// debug.style.display = "block";

		while (household.firstChild) {
			household.removeChild(household.firstChild);
		}

		form.reset();
	}
});
