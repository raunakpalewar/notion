const USERS_API_ENDPOINT = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

let users = [];
let currentPage = 1;
let searchTerm = '';
const ITEMS_PER_PAGE = 10;

const fetchUsers = async () => {
  try {
    const response = await fetch(USERS_API_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    users = await response.json();
    renderTable();
    renderPagination();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const renderTable = () => {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(start, start + ITEMS_PER_PAGE);

  paginatedUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td contenteditable="true">${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <!-- Other columns -->
      <td><input type="checkbox" data-id="${user.id}"></td>
    `;
    tableBody.appendChild(row);
  });
};

const renderPagination = () => {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', () => {
      currentPage = i;
      renderTable();
      renderPagination();
    });
    pagination.appendChild(button);
  }
};

const handleSearch = () => {
  searchTerm = document.getElementById('searchInput').value;
  currentPage = 1;
  renderTable();
  renderPagination();
};

const handleDeleteSelected = () => {
  const checkboxes = document.querySelectorAll('#userTable input[type="checkbox"]:checked');
  checkboxes.forEach(checkbox => {
    const userId = checkbox.getAttribute('data-id');
    users = users.filter(user => user.id !== userId);
  });
  renderTable();
  renderPagination();
};

const init = () => {
  fetchUsers();

  document.getElementById('searchInput').addEventListener('input', handleSearch);
  document.getElementById('deleteSelected').addEventListener('click', handleDeleteSelected);
};

init();
