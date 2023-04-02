// Fetch JSON data
async function fetchData(file) {
  try {
    const response = await fetch(`data/${file}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${file}:`, error);
  }
}

// Render filter options
async function renderFilterOptions() {
  const resourceTypes = await fetchData("res_type.json");
  const aiFields = await fetchData("ai_field.json");

  const resourceTypeSelect = document.getElementById("resource-type");
  const aiFieldSelect = document.getElementById("ai-field");

  // Add 'All' option to both filters
  resourceTypeSelect.innerHTML = '<option value="all">All</option>';
  aiFieldSelect.innerHTML = '<option value="all">All</option>';

  // Add options for resource types
  for (const resourceType of resourceTypes) {
    const option = document.createElement("option");
    option.value = resourceType.id;
    option.textContent = resourceType.name;
    resourceTypeSelect.appendChild(option);
  }

  // Add options for AI fields
  for (const aiField of aiFields) {
    const option = document.createElement("option");
    option.value = aiField.id;
    option.textContent = aiField.name;
    aiFieldSelect.appendChild(option);
  }
}

// Render resources
async function renderResources() {
  const resources = await fetchData("resources.json");
  const resourceTypeSelect = document.getElementById("resource-type");
  const aiFieldSelect = document.getElementById("ai-field");
  const resultsDiv = document.querySelector(".results");

  function filterResources() {
    const selectedResourceType = resourceTypeSelect.value;
    const selectedAiField = aiFieldSelect.value;

    const filteredResources = resources.filter((resource) => {
      const typeMatches =
        selectedResourceType === "all" ||
        resource.type.includes(selectedResourceType);
      const fieldMatches =
        selectedAiField === "all" || resource.field.includes(selectedAiField);
      return typeMatches && fieldMatches;
    });

    return filteredResources;
  }

  async function displayResources() {
    resultsDiv.innerHTML = "";
    const filteredResources = filterResources();

    for (const resource of filteredResources) {
      const resultDiv = document.createElement("div");
      resultDiv.classList.add("result");

      const title = document.createElement("h3");
      title.textContent = resource.name;

      const link = document.createElement("a");
      link.href = resource.url;
      link.textContent = resource.url;

      const resourceTypes = await fetchData("res_type.json");
      const aiFields = await fetchData("ai_field.json");

      const types = resource.type
        .map((typeId) => resourceTypes.find((rt) => rt.id === typeId).name)
        .join(", ");
      const fields = resource.field
        .map((fieldId) => aiFields.find((af) => af.id === fieldId).name)
        .join(", ");
      
       

      const typeInfo = document.createElement("p");
      typeInfo.classList.add("resource-info");

      const typeLabel = document.createElement("span");
      typeLabel.textContent = "Resource Type:";
      typeLabel.classList.add("label");

      const typeEntries = document.createElement("span");
      typeEntries.textContent = ` ${types}`;
      typeEntries.classList.add("entries");

      const fieldInfo = document.createElement("p");
      fieldInfo.classList.add("resource-info");

      const fieldLabel = document.createElement("span");
      fieldLabel.textContent = "AI Fields:";
      fieldLabel.classList.add("label");

      const fieldEntries = document.createElement("span");
      fieldEntries.textContent = ` ${fields}`;
      fieldEntries.classList.add("entries");

      typeInfo.appendChild(typeLabel);
      typeInfo.appendChild(typeEntries);
      fieldInfo.appendChild(fieldLabel);
      fieldInfo.appendChild(fieldEntries);

      resultDiv.appendChild(title);
      resultDiv.appendChild(link);
      resultDiv.appendChild(typeInfo);
      resultDiv.appendChild(fieldInfo);
      resultsDiv.appendChild(resultDiv);
    }
  }

  resourceTypeSelect.addEventListener("change", displayResources);
  aiFieldSelect.addEventListener("change", displayResources);

  displayResources();
}

renderFilterOptions();
renderResources();
