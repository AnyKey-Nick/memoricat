// Main application logic
let currentUser = null;

// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    currentUser = JSON.parse(userData);
    document.getElementById('authBtn').textContent = 'Logout';
    document.getElementById('authBtn').onclick = logout;
  }
}

// Show home page
function showHome() {
  document.getElementById('content').innerHTML = `
    <div class="hero">
      <h2>Learn Languages with MEMCAT</h2>
      <p>Master new languages with our Memrise-style learning system</p>
      <button class="btn btn-primary" onclick="showCourses()">Browse Courses</button>
    </div>
  `;
}

// Show courses
async function showCourses() {
  try {
    const courses = await api.getCourses();
    
    let html = '<div class="courses-grid">';
    courses.forEach(course => {
      html += `
        <div class="course-card" onclick="startCourse('${course._id}')">
          <h3>${course.title}</h3>
          <p>${course.targetLanguage} → ${course.instructionLanguage}</p>
          <button class="btn">Start Learning</button>
        </div>
      `;
    });
    html += '</div>';
    
    document.getElementById('content').innerHTML = html;
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// Show auth form
function showAuth() {
  document.getElementById('content').innerHTML = `
    <div class="auth-container">
      <div class="auth-form">
        <h2>Login to MEMCAT</h2>
        <form onsubmit="handleLogin(event)">
          <input type="email" id="email" placeholder="Email" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p>Don't have an account? <a href="#" onclick="showRegister()">Register</a></p>
      </div>
    </div>
  `;
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const data = await api.login({ email, password });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentUser = data.user;
      checkAuth();
      showHome();
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  document.getElementById('authBtn').textContent = 'Login';
  document.getElementById('authBtn').onclick = showAuth;
  showHome();
}

// Initialize app
window.onload = function() {
  checkAuth();
  showHome();
};