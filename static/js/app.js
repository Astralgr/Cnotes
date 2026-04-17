
// Firebase Configuration
const firebaseConfig = {

  apiKey: "AIzaSyD0sFHiPsOfDJFLB3Ak-Tn-xeWvTsdzPKg",

  authDomain: "salesflow-b96a8.firebaseapp.com",

  projectId: "salesflow-b96a8",

  storageBucket: "salesflow-b96a8.firebasestorage.app",

  messagingSenderId: "684901199328",

  appId: "1:684901199328:web:313da7d811a754f7378f85",

  measurementId: "G-NRLQ2RVVYB"

};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let isSignUpMode = false;

function openAuthModal() {
    const user = auth.currentUser;
    if (user) {
        document.getElementById('authContent').style.display = 'none';
        document.getElementById('authUserInfo').style.display = 'block';
        document.getElementById('authUserName').textContent = user.displayName || 'User';
        document.getElementById('authUserEmail').textContent = user.email;
        document.getElementById('authModalTitle').textContent = 'Account';
    } else {
        document.getElementById('authContent').style.display = 'block';
        document.getElementById('authUserInfo').style.display = 'none';
        document.getElementById('authModalTitle').textContent = 'Sign In';
    }
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('authForm').reset();
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('authNameGroup').style.display = isSignUpMode ? 'block' : 'none';
    document.getElementById('authSubmitBtn').textContent = isSignUpMode ? 'Create Account' : 'Sign In';
    document.getElementById('authToggleBtn').textContent = isSignUpMode ? 'Have an account? Sign In' : 'Need an account? Sign Up';
    document.getElementById('authModalTitle').textContent = isSignUpMode ? 'Create Account' : 'Sign In';
}

async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        closeAuthModal();
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Signed in with Google!', 'success');
    } catch (error) {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> ' + error.message, 'error');
    }
}

async function handleEmailAuth(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const displayName = document.getElementById('authDisplayName').value;
    
    try {
        if (isSignUpMode) {
            const cred = await auth.createUserWithEmailAndPassword(email, password);
            if (displayName) await cred.user.updateProfile({ displayName });
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Account created!', 'success');
        } else {
            await auth.signInWithEmailAndPassword(email, password);
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Signed in!', 'success');
        }
        closeAuthModal();
} catch (error) {
    if (error.code === 'auth/user-not-found') {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> No account found. Please sign up first.', 'error');
    } else if (error.code === 'auth/wrong-password') {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Incorrect password', 'error');
    } else if (error.code === 'auth/invalid-email') {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Invalid email format', 'error');
    } else if (error.code === 'auth/email-already-in-use') {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Email already registered. Try signing in.', 'error');
    } else if (error.code === 'auth/weak-password') {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Password too weak (min 6 characters)', 'error');
    } else if (error.code === 'auth/too-many-requests') {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Too many attempts. Try again later.', 'error');
    } else {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> ' + error.message, 'error');
    }
}
}

async function signOutUser() {
    try {
 // Close auth modal first
        closeAuthModal();
        
 // Sign out — onAuthStateChanged will handle state reset
        await auth.signOut();
        
        showToast('<span class="icon icon-hand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v4"/><path d="M14 10V4a2 2 0 0 0-4 0v7"/><path d="M10 10.5V2a2 2 0 0 0-4 0v9"/><path d="M6 11a2 2 0 0 0-4 0v3a8 8 0 0 0 16 0v-1a2 2 0 0 0-4 0"/></svg></span> Signed out successfully!', 'success');
        
    } catch (error) {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> ' + error.message, 'error');
    }
}


function updateAuthUI(user) {
    const area = document.getElementById('userAuthArea');
    if (user) {
        const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
        const photoHTML = user.photoURL 
            ? `<img src="${user.photoURL}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display='none';this.parentElement.textContent='${initial}'">` 
            : initial;
        area.innerHTML = `<div class="user-avatar" onclick="openSettingsModal()" title="Settings">${photoHTML}</div>`;
        state.currentUser = { id: user.uid, email: user.email, name: user.displayName || user.email };
    } else {
        area.innerHTML = `<button class="btn-sign-in" onclick="openAuthModal()"><svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg><span>Sign In</span></button>`;
        state.currentUser = null;
    }
}

// Listen for auth state changes
auth.onAuthStateChanged(async (user) => {
    updateAuthUI(user);
    if (user) {
        await loadUserDataFromFirestore(user.uid);
        await loadSettingsFromFirestore(user.uid);
        await loadSharingData();
        
 // Stripe verification runs AFTER Firestore data is loaded
        // This prevents Firestore from overwriting the newly verified plan
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        
        if (sessionId) {
            try {
                const response = await fetch(
                    'https://web-production-fcbb6.up.railway.app/verify-session?session_id=' + sessionId
                );
                const data = await response.json();
                
                if (data.plan) {
                    state.subscription.plan = data.plan;
                    state.subscription.status = 'active';
                    state.subscription.billing = data.billing || 'monthly';
                    state.subscription.stripeCustomerId = data.stripeCustomerId || null;
                    state.subscription.stripeSubscriptionId = data.stripeSubscriptionId || null;
                    state.subscription.periodEnd = data.periodEnd || null;
                    state.subscription.cancelAt = null;
                    state.subscription.subscribedAt = new Date().toISOString();
                    
 // Save BEFORE render so UI shows correct plan
                    await saveSubscription();
                    await saveUserDataToFirestore();
                    
                    window.history.replaceState({}, '', window.location.pathname);
                    
                    showToast(
                        'Welcome to the ' + 
                        data.plan.charAt(0).toUpperCase() + 
                        data.plan.slice(1) + 
                        ' plan! <span class="icon icon-party"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3L2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="M22 13l-1.34-.45a2.9 2.9 0 0 0-3.12 1.96v0a1.53 1.53 0 0 1-1.63 1.45h0a1.77 1.77 0 0 0-1.44 1.76L14 20"/></svg></span>', 
                        'success'
                    );
                }
            } catch (err) {
                console.error('Stripe verification error:', err);
                showToast('Could not verify payment. Please contact support.', 'error');
            }
        }
        
} else {
 // Reset ALL state to defaults on sign out
    state.tasks = [];
    state.notes = [];
    state.customers = [];
    state.meetings = [];
    state.CustomerInfos = [];
    state.sharedMeetings = [];
    state.myShares = [];
    state.meetingTabs = [
        { id: 'all', name: 'All Meetings', icon: '', isDefault: true },
        { id: 'individual', name: 'Individual', icon: '', isDefault: true }
    ];
    state.currentUser = null;
    state.currentCustomer = 'all';
    state.currentMeetingTab = 'all';
    
 // Reset subscription to free — never load from localStorage on sign out
    state.subscription = { 
        plan: 'free', 
        status: 'active',
        cancelAt: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        periodEnd: null
    };
    
 // Clear localStorage subscription so it doesn't persist
    localStorage.removeItem('cnotes_subscription');
    
 // Close any open forms or modals
    closeInlineMeetingForm();
    closeInlineCustomerInfoForm();
    document.querySelectorAll('.modal.active').forEach(m => 
        m.classList.remove('active')
    );
    
 // Remove reactivate button if visible
    const reactivateBtn = document.getElementById('reactivatePlanBtn');
    if (reactivateBtn) reactivateBtn.remove();
    
 // Reset customer banner
    document.getElementById('customerHeaderBanner')
        .classList.remove('active');
    document.getElementById('frozenBanner')
        .style.display = 'none';
    
 // Clear sidebar active states
    document.querySelectorAll('.category-filter')
        .forEach(b => b.classList.remove('active'));
}


checkSubscriptionExpiry(); 
state.currentCustomer = 'all';
state.currentMeetingTab = 'all';

// Full UI reset for both sign in and sign out
render();
renderCustomerFilters();
renderCustomerSlots();
updateStats();
updateShareNotificationBadge();
updatePlanCards();
showDashboard();

// Reset main section title
document.getElementById('mainSectionTitle').textContent = 'Tasks';

// Hide loader once everything is ready
setTimeout(() => {
    document.getElementById('appLoader').classList.add('hidden');
}, 300);


});



function confirmDeleteAccount() {
    if (!auth.currentUser) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Not signed in', 'error');
        return;
    }
    
    // Close auth modal first
    closeAuthModal();
    
    // Show confirmation with extra warning
    document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>';
    document.getElementById('confirmTitle').textContent = 'Delete Account?';
    document.getElementById('confirmMessage').innerHTML = `
        <div style="text-align: left;">
            <p style="margin-bottom: 0.75rem;"><strong>This action is permanent and cannot be undone!</strong></p>
            <p style="margin-bottom: 0.75rem;">The following will be permanently deleted:</p>
            <ul style="margin-left: 1.5rem; margin-bottom: 0.75rem;">
                <li>${state.customers.length} customer(s)</li>
                <li>${state.meetings.length} meeting(s)</li>
                <li>${state.tasks.length} task(s)</li>
                <li>${state.notes.length} note(s)</li>
                <li>${state.CustomerInfos.length} customer info(s)</li>
                <li>${state.myShares.length} shared meeting(s)</li>
            </ul>
            <p style="color: var(--danger); font-weight: 600;">Your account and all data will be permanently deleted.</p>
        </div>
    `;
    
    // Show cancel button
    const cancelBtn = document.getElementById('cancelConfirmBtn');
    cancelBtn.style.display = '';
    
    // Configure delete button
    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.innerHTML = '<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span> Delete Forever';
    newConfirmBtn.className = 'btn btn-danger';
    
    newConfirmBtn.addEventListener('click', () => {
        document.getElementById('confirmModal').classList.remove('active');
        // Show second confirmation for extra safety
        showFinalDeleteConfirmation();
    });
    
    state.confirmCallback = null;
    document.getElementById('confirmModal').classList.add('active');
}

function showFinalDeleteConfirmation() {
    // Second confirmation with email verification
    const userEmail = auth.currentUser.email;
    
    document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-alert-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>';
    document.getElementById('confirmTitle').textContent = 'Final Confirmation';
    document.getElementById('confirmMessage').innerHTML = `
        <div style="text-align: center;">
            <p style="margin-bottom: 1rem;">Type your email to confirm deletion:</p>
            <input type="email" id="deleteConfirmEmail" class="form-input" placeholder="${userEmail}" style="margin-bottom: 0.75rem;">
            <p style="font-size: 0.8rem; color: var(--text-secondary);">This will permanently delete your account.</p>
        </div>
    `;
    
    // Show cancel button
    const cancelBtn = document.getElementById('cancelConfirmBtn');
    cancelBtn.style.display = '';
    
    // Configure delete button
    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.textContent = 'Delete My Account';
    newConfirmBtn.className = 'btn btn-danger';
    
    newConfirmBtn.addEventListener('click', async () => {
        const enteredEmail = document.getElementById('deleteConfirmEmail').value.trim().toLowerCase();
        
        if (enteredEmail !== userEmail.toLowerCase()) {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Email does not match', 'error');
            return;
        }
        
        document.getElementById('confirmModal').classList.remove('active');
        await deleteUserAccount();
    });
    
    state.confirmCallback = null;
    document.getElementById('confirmModal').classList.add('active');
    
    // Focus the email input
    setTimeout(() => {
        document.getElementById('deleteConfirmEmail')?.focus();
    }, 100);
}

async function deleteUserAccount() {
    if (!auth.currentUser) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Not signed in', 'error');
        return;
    }
    
    const user = auth.currentUser;
    const userId = user.uid;
    const userEmail = user.email.toLowerCase();
    
    // Show loading toast
    showToast('<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Deleting account...', 'success');
    
    try {
        const deletePromises = [];
        
        // 1. Delete shared meetings where user is the sharer (shared BY me)
        const sharedByMe = await db.collection('sharedMeetings')
            .where('sharedBy', '==', userId)
            .get();
        
        sharedByMe.docs.forEach(doc => {
            deletePromises.push(doc.ref.delete());
        });
        
        // 2. Delete shared meetings where user is the recipient (shared WITH me)
        const sharedWithMe = await db.collection('sharedMeetings')
            .where('sharedWithEmail', '==', userEmail)
            .get();
        
        sharedWithMe.docs.forEach(doc => {
            deletePromises.push(doc.ref.delete());
        });
        
        // 3. Delete user's main data document
        deletePromises.push(db.collection('users').doc(userId).delete());
        
        // Wait for all Firestore deletes to complete
        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
            console.log(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Deleted ${deletePromises.length} document(s) from Firestore`);
        }
        
        // 4. Clear local state
        state.tasks = [];
        state.notes = [];
        state.customers = [];
        state.meetings = [];
        state.CustomerInfos = [];
        state.sharedMeetings = [];
        state.myShares = [];
        state.meetingTabs = [
            { id: 'all', name: 'All Meetings', icon: '', isDefault: true },
            { id: 'individual', name: 'Individual', icon: '', isDefault: true }
        ];
        state.currentUser = null;
        
        // 5. Clear localStorage
        localStorage.clear();
        
        // 6. Delete the Firebase Auth account
        await user.delete();
        
        // 7. Update UI
        updateAuthUI(null);
        render();
        updateStats();
        renderCustomerFilters();
        updateShareNotificationBadge();
        showDashboard();
        
        // Show success message
        showAccountDeletedSuccess();
        
    } catch (error) {
        console.error('Error deleting account:', error);
        
        // Handle specific errors
        if (error.code === 'auth/requires-recent-login') {
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Please sign out, sign back in, and try again', 'error');
        } else {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed to delete account: ' + error.message, 'error');
        }
    }
}

function showAccountDeletedSuccess() {
    document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>';
    document.getElementById('confirmTitle').textContent = 'Account Deleted';
    document.getElementById('confirmMessage').textContent = 'Your account and all associated data have been permanently deleted.';
    
    // Hide cancel button
    const cancelBtn = document.getElementById('cancelConfirmBtn');
    cancelBtn.style.display = 'none';
    
    // Configure OK button
    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.textContent = 'OK';
    newConfirmBtn.className = 'btn btn-primary';
    
    newConfirmBtn.addEventListener('click', () => {
        document.getElementById('confirmModal').classList.remove('active');
        // Restore cancel button for future confirms
        document.getElementById('cancelConfirmBtn').style.display = '';
        // Reset confirm button styling
        const btn = document.getElementById('confirmBtn');
        btn.textContent = 'Confirm';
        btn.className = 'btn btn-danger';
    });
    
    state.confirmCallback = null;
    document.getElementById('confirmModal').classList.add('active');
}

async function loadUserDataFromFirestore(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            const data = doc.data();
            state.tasks = data.tasks || [];
            state.notes = data.notes || [];
            state.meetings = data.meetings || [];
            state.CustomerInfos = data.CustomerInfos || [];
            state.meetingTabs = data.meetingTabs || [
                { id: 'all', name: 'All Meetings', icon: '', isDefault: true },
                { id: 'individual', name: 'Individual', icon: '', isDefault: true }
            ];
            state.sharedMeetings = data.sharedMeetings || [];
            state.myShares = data.myShares || [];
    if (data.prepTitles) {
        state.prepTitles = data.prepTitles;
    }

            // ← KEY FIX: if Firestore has no customers, fall back to localStorage
            if (data.customers && data.customers.length > 0) {
                state.customers = data.customers;
            } else {
                const localCustomers = localStorage.getItem('cnotes_customers');
                state.customers = localCustomers ? JSON.parse(localCustomers) : [];
                // If we recovered from localStorage, push it up to Firestore
                if (state.customers.length > 0) {
                    saveUserDataToFirestore().catch(console.error);
                }
            }

            if (data.subscription) {
                state.subscription = data.subscription;
                localStorage.setItem('cnotes_subscription', JSON.stringify(state.subscription));
            }
        } else {
            // No Firestore doc at all — load everything from localStorage
            loadData();
        }
    } catch (error) {
        console.error('Error loading from Firestore, falling back to localStorage:', error);
        loadData(); // your existing localStorage load function
    }
}



// ── Settings Cloud Sync ──
async function saveSettingsToFirestore() {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await db.collection('users').doc(user.uid).set({
            userSettings: {
                ai: JSON.parse(localStorage.getItem('cnotes_ai_settings') || '{}'),
                notifications: JSON.parse(localStorage.getItem('cnotes_notif_settings') || '{}'),
                activityThresholds: JSON.parse(localStorage.getItem('cnotes_activity_thresholds') || '{}'),
                theme: localStorage.getItem('theme') || 'light',
            }
        }, { merge: true });
    } catch (err) {
        console.error('Settings sync failed:', err);
    }
}

async function loadSettingsFromFirestore(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists && doc.data().userSettings) {
            const s = doc.data().userSettings;
            if (s.ai) localStorage.setItem('cnotes_ai_settings', JSON.stringify(s.ai));
            if (s.notifications) localStorage.setItem('cnotes_notif_settings', JSON.stringify(s.notifications));
            if (s.activityThresholds) localStorage.setItem('cnotes_activity_thresholds', JSON.stringify(s.activityThresholds));
            if (s.theme) {
                localStorage.setItem('theme', s.theme);
                document.documentElement.setAttribute('data-theme', s.theme);
            }
        }
    } catch (err) {
        console.error('Settings load failed:', err);
    }
}

async function saveUserDataToFirestore() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        // Firestore rejects undefined values — JSON roundtrip strips them safely
        const strip = (data) => JSON.parse(JSON.stringify(data));

        await db.collection('users').doc(user.uid).set({
            tasks: strip(state.tasks),
            notes: strip(state.notes),
            customers: strip(state.customers),
            meetings: strip(state.meetings),
            CustomerInfos: strip(state.CustomerInfos),
            meetingTabs: strip(state.meetingTabs),
            sharedMeetings: strip(state.sharedMeetings),
            myShares: strip(state.myShares),
            subscription: strip(state.subscription),
 prepTitles: strip(state.prepTitles),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

    } catch (error) {
        console.error('Firestore save error:', error.code, error.message);
        throw error;
    }
}



       const state = {
subscription: { plan: 'free', status: 'active' },
    tasks: [],
    notes: [],
    customers: [],
    meetings: [],
    CustomerInfos: [],
    // ========== SHARING FEATURE - START ==========
    sharedMeetings: [], // Meetings shared with me
    myShares: [], // Meetings I've shared
    shareNotifications: [], // Pending notifications
   currentUser: null,
    // ========== SHARING FEATURE - END ==========
    meetingTabs: [],
    currentMeetingTab: 'all',
    editingTabId: null,
    selectedTabIcon: '',
    draggedMeetingId: null,
    currentCategory: 'all',
    currentCustomer: 'all',
    upcomingMeetingsPeriod: 'all',
    currentFilter: 'all',
    currentView: 'active',
    currentDisplayMode: 'list',
    searchQuery: '',
    editingTask: null,
    editingNote: null,
    editingCustomer: null,
    editingMeeting: null,
    editingCustomerInfo: null,
    selectedColor: 'none',
    confirmCallback: null,
    meetingTasks: [],           
    meetingParticipants: [],     
    selectedCustomerId: null,
    selectedTaskCustomerId: null,
selectedNoteCustomerId: null,
    selectedCustomerInfoCustomerId: null,
    selectedTag: null,
    currentMeetingTab: 'info',
    currentCustomerInfoTab: 'info',
    returningToMeetingForm: false, 
    savedMeetingFormData: null,
        editingParticipantIndex: null,
    activityFilter: 'all',
activityCustomRange: { start: null, end: null },
 prepTitles: {
        title_background: 'Background & Context',
        title_discussion: 'Discussion Points',
        title_materials: 'Competitive Intelligence',
        title_outcomes: 'Expected Outcomes'
    },
};

// ========== PINNED CUSTOMERS FUNCTIONS - START ==========
function togglePinCustomer(customerId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Toggle pinned state
    customer.pinned = !customer.pinned;
    
    // Animate the star
    const starElement = event?.target;
    if (starElement) {
        starElement.classList.add('animate');
        setTimeout(() => starElement.classList.remove('animate'), 400);
    }
    
    saveData();
    renderCustomerFilters();
    
    // Update banner pin button if viewing this customer
    if (state.currentCustomer === customerId) {
        updateBannerPinButton(customerId);
    }
    
    // Show toast
    if (customer.pinned) {
        showToast(`<span class="icon icon-star"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span> ${customer.name} added to Priority Accounts`, 'success');
    } else {
        showToast(`${customer.name} removed from Priority Accounts`, 'success');
    }
}

function togglePinFromBanner() {
    if (state.currentCustomer && state.currentCustomer !== 'all') {
        togglePinCustomer(state.currentCustomer);
    }
}

function updateBannerPinButton(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    const pinIcon = document.getElementById('bannerPinIcon');
    const pinBtn = document.getElementById('bannerPinBtn');
    
    if (!pinIcon || !pinBtn) return;
    
    if (customer && customer.pinned) {
        pinIcon.innerHTML = '<span class="icon icon-star-filled"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>';
        pinIcon.style.color = '#fbbf24';
        pinBtn.title = 'Unpin from Priority';
    } else {
        pinIcon.innerHTML = '<span class="icon icon-star-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>';
        pinIcon.style.color = '';
        pinBtn.title = 'Pin to Priority';
    }
}
// ========== PINNED CUSTOMERS FUNCTIONS - END ==========

function renameCustomerFromSidebar(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const newName = prompt('Rename customer:', customer.name);
    if (!newName || newName.trim() === '') return;
    if (newName.trim() === customer.name) return;
    
    const trimmedName = newName.trim();
    
    // Check if name already exists
    if (state.customers.some(c => c.id !== customerId && c.name.toLowerCase() === trimmedName.toLowerCase())) {
        showToast('Name already exists', 'error');
        return;
    }
    
    // Update customer
    customer.name = trimmedName;
    
    // Update all references
    state.tasks.forEach(task => {
        if (task.customerId === customerId) {
            task.customerName = trimmedName;
        }
    });
    
    state.meetings.forEach(meeting => {
        if (meeting.customerId === customerId) {
            meeting.customerName = trimmedName;
        }
    });
    
    state.CustomerInfos.forEach(prep => {
        if (prep.customerId === customerId) {
            prep.customerName = trimmedName;
        }
    });
    
    saveData();
    renderCustomerFilters();
    renderCustomerList();
    
    // Update header if viewing this customer
    if (state.currentCustomer === customerId) {
        document.getElementById('customerHeaderName').textContent = trimmedName;
    }
    
    // Refresh visible sections
if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) renderUpcomingMeetings();
if (document.getElementById('customerActivitySection').classList.contains('active')) renderCustomerActivity();

showToast('Renamed!', 'success');
}

function deleteCustomerFromSidebar(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Count associated data
    const taskCount = state.tasks.filter(t => t.customerId === customerId).length;
    const meetingCount = state.meetings.filter(m => m.customerId === customerId).length;
    const prepCount = state.CustomerInfos.filter(p => p.customerId === customerId).length;
    
    let message = `Delete "${customer.name}"?`;
    
    if (taskCount > 0 || meetingCount > 0 || prepCount > 0) {
        const parts = [];
        if (meetingCount > 0) parts.push(`${meetingCount} meeting${meetingCount !== 1 ? 's' : ''}`);
        if (taskCount > 0) parts.push(`${taskCount} task${taskCount !== 1 ? 's' : ''}`);
        if (prepCount > 0) parts.push(`${prepCount} customer info${prepCount !== 1 ? 's' : ''}`);
        message = `Delete "${customer.name}"?\n\nThis will also remove:\n• ${parts.join('\n• ')}`;
    }
    
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete Customer?', message, () => {
        // Remove customer
        state.customers = state.customers.filter(c => c.id !== customerId);
        
        // Remove all meetings associated with this customer
        state.meetings = state.meetings.filter(m => m.customerId !== customerId);
        
        // Remove all CustomerInfos associated with this customer
        state.CustomerInfos = state.CustomerInfos.filter(p => p.customerId !== customerId);
        
        // Remove customer reference from tasks (or optionally delete tasks entirely)
        state.tasks.forEach(task => {
            if (task.customerId === customerId) {
                task.customerId = null;
                task.customerName = '';
            }
        });
        
        // Save data
        saveData();
        
        // Refresh customer filters in sidebar
        renderCustomerFilters();
        
        // Refresh All Customers section if visible
        if (document.getElementById('allCustomersSection').classList.contains('active')) {
            renderAllCustomersList();
        }
        
        // Refresh Customer Activity section if visible
        if (document.getElementById('customerActivitySection').classList.contains('active')) {
            renderCustomerActivity();
        }
        
        // Refresh Upcoming Meetings section if visible
        if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
            renderUpcomingMeetings();
        }
        
        // Refresh tasks list
        renderTasks();
        
        // Update stats
        updateStats();
        
        // If currently viewing this customer, go back to dashboard
        if (state.currentCustomer === customerId) {
            showDashboard();
        }
        
        showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> "${customer.name}" and all associated data deleted`, 'success');
    });
}


function renameCustomerFromHeader() {
    if (state.currentCustomer === 'all') return;
    renameCustomerFromSidebar(state.currentCustomer);
}

function deleteCustomerFromHeader() {
    if (state.currentCustomer === 'all') return;
    deleteCustomerFromSidebar(state.currentCustomer);
}

function deleteCustomerInfo(CustomerInfoId) {
    const CustomerInfo = state.CustomerInfos.find(p => p.id === CustomerInfoId);
    if (!CustomerInfo) return;
    
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete CustomerInfo?', `Delete this CustomerInfo for ${CustomerInfo.customerName}?`, () => {
        state.CustomerInfos = state.CustomerInfos.filter(p => p.id !== CustomerInfoId);
        saveData();
        
        // Update customer CustomerInfos section if visible
        if (state.currentCustomer !== 'all') {
            showCustomerCustomerInfosSection(state.currentCustomer);
        }
        

        
        updateStats();
        showToast('Deleted', 'success');
    });
}

function savePrepTitle(element, key) {
    const newTitle = element.innerText.trim();
    const defaults = {
        title_background: 'Background & Context',
        title_discussion: 'Discussion Points',
        title_materials: 'Competitive Intelligence',
        title_outcomes: 'Expected Outcomes'
    };

    if (!newTitle) {
        element.innerText = defaults[key];
        state.prepTitles[key] = defaults[key];
    } else {
        state.prepTitles[key] = newTitle;
    }

    // Save to localStorage as fallback
    localStorage.setItem('cnotes_prepTitles', JSON.stringify(state.prepTitles));

    // Save to Firestore if signed in
    saveData();
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Title saved!', 'success');
}

function loadPrepTitles() {
    // state.prepTitles is already populated by loadUserDataFromFirestore()
    // but fall back to localStorage if not signed in
    const localSaved = localStorage.getItem('cnotes_prepTitles');
    if (localSaved && !auth.currentUser) {
        state.prepTitles = JSON.parse(localSaved);
    }

    const fields = ['title_background', 'title_discussion', 'title_materials', 'title_outcomes'];
    fields.forEach(key => {
        const el = document.querySelector(`[data-prep-field="${key}"]`);
        if (el && state.prepTitles[key]) {
            el.innerText = state.prepTitles[key];
        }
    });
}

function deleteMeetingFromCustomer(meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    const hasTasks = state.tasks.some(t => t.meetingId === meetingId);
    const message = hasTasks 
        ? `Delete this meeting? Associated tasks will remain but lose their meeting link.`
        : `Delete this meeting?`;
    
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete Meeting?', message, () => {
        state.meetings = state.meetings.filter(m => m.id !== meetingId);
        
        // Remove meeting reference from tasks
        state.tasks.forEach(task => {
            if (task.meetingId === meetingId) {
                delete task.meetingId;
            }
        });
        
        saveData();
        
        // Update customer meetings section if visible
        if (state.currentCustomer !== 'all') {
            showCustomerMeetingsSection(state.currentCustomer);
        }
        

        
        // ADD THIS: Refresh upcoming meetings if visible
        if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
            renderUpcomingMeetings();
        }
        
        updateStats();
        showToast('Deleted', 'success');
    });
}

function editCustomerFromBanner() {
    if (state.currentCustomer === 'all') return;
    openEditCustomerForm(state.currentCustomer);
}

function updateCustomerBanner(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const banner = document.getElementById('customerHeaderBanner');
    const nameEl = document.getElementById('customerHeaderName');
    const detailsEl = document.getElementById('customerBannerDetails');
    
    nameEl.textContent = customer.name;
nameEl.style.cursor = 'pointer';
nameEl.onclick = () => editCustomerFromBanner();
    updateBannerPinButton(customerId);
    
const logoEl = document.querySelector('.customer-header-icon');
if (customer.website) {
    let domain = customer.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    logoEl.innerHTML = `<img src="${logoUrl}" alt="${escapeHtml(customer.name)}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: contain; background: white; padding: 4px;" onerror="this.outerHTML=getBuildingSVG(40,'white')">`;
} else {
    logoEl.innerHTML = getBuildingSVG(40, 'white');
}

    
    // Build details horizontally
let detailsHTML = '';

if (customer.email) {
    detailsHTML += `
        <div class="customer-banner-detail">
            <div class="customer-banner-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
            </div>
            <div class="customer-banner-detail-content">
                <div class="customer-banner-detail-value"><a href="mailto:${escapeHtml(customer.email)}">${escapeHtml(customer.email)}</a></div>
            </div>
        </div>
    `;
}

if (customer.phone) {
    detailsHTML += `
        <div class="customer-banner-detail">
            <div class="customer-banner-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            </div>
            <div class="customer-banner-detail-content">
                <div class="customer-banner-detail-value"><a href="tel:${escapeHtml(customer.phone)}">${escapeHtml(customer.phone)}</a></div>
            </div>
        </div>
    `;
}

if (customer.address || customer.city) {
    let addressText = '';
    if (customer.address) addressText += customer.address;
    if (customer.city) {
        if (addressText) addressText += ', ';
        addressText += customer.city;
    }
    if (customer.state) addressText += ', ' + customer.state;
    if (customer.zip) addressText += ' ' + customer.zip;
    
    detailsHTML += `
        <div class="customer-banner-detail">
            <div class="customer-banner-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </div>
            <div class="customer-banner-detail-content">
                <div class="customer-banner-detail-value">
                    ${customer.mapsLink ? `<a href="${escapeHtml(customer.mapsLink)}" target="_blank">${escapeHtml(addressText)}</a>` : escapeHtml(addressText)}
                </div>
            </div>
        </div>
    `;
}

if (customer.website) {
    detailsHTML += `
        <div class="customer-banner-detail">
            <div class="customer-banner-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </div>
            <div class="customer-banner-detail-content">
                <div class="customer-banner-detail-value"><a href="${escapeHtml(customer.website)}" target="_blank">Website</a></div>
            </div>
        </div>
    `;
}

if (customer.industry) {
    detailsHTML += `
        <div class="customer-banner-detail">
            <div class="customer-banner-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 7h-9"></path>
                    <path d="M14 17H5"></path>
                    <circle cx="17" cy="17" r="3"></circle>
                    <circle cx="7" cy="7" r="3"></circle>
                </svg>
            </div>
            <div class="customer-banner-detail-content">
                <div class="customer-banner-detail-value">${escapeHtml(customer.industry)}</div>
            </div>
        </div>
    `;
}

if (customer.size) {
    detailsHTML += `
        <div class="customer-banner-detail">
            <div class="customer-banner-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </div>
            <div class="customer-banner-detail-content">
                <div class="customer-banner-detail-value">${escapeHtml(customer.size)}</div>
            </div>
        </div>
    `;
}

if (customer.linkedIn) {
    detailsHTML += `
        <div class="customer-banner-detail">
            <div class="customer-banner-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                </svg>
            </div>
            <div class="customer-banner-detail-content">
                <div class="customer-banner-detail-value"><a href="${escapeHtml(customer.linkedIn)}" target="_blank">LinkedIn</a></div>
            </div>
        </div>
    `;
}

detailsEl.innerHTML = detailsHTML;
}

function getParticipantKey(participant) {
    // Create a consistent unique key for each participant
    if (participant.email && participant.email.trim()) {
        return participant.email.toLowerCase().trim();
    }
    return participant.name.toLowerCase().trim();
}

function openAddParticipantModal(customerId) {
    const modal = document.getElementById('addParticipantModal');
    const form = document.getElementById('addParticipantForm');
    const meetingSelect = document.getElementById('addParticipantMeetingId');
    
    // Reset form
    form.reset();
    document.getElementById('addParticipantCustomerId').value = customerId;
    
    // Populate meeting dropdown with meetings for this customer
    const customerMeetings = state.meetings.filter(m => m.customerId === customerId);
    meetingSelect.innerHTML = '<option value="">Don\'t add to a specific meeting</option>';
    
    if (customerMeetings.length > 0) {
        customerMeetings.forEach(meeting => {
            const option = document.createElement('option');
            option.value = meeting.id;
            option.textContent = `${meeting.title} - ${new Date(meeting.date).toLocaleDateString()}`;
            meetingSelect.appendChild(option);
        });
    }
    
    // Set up event listeners
    const closeBtn = document.getElementById('closeAddParticipantBtn');
    const cancelBtn = document.getElementById('cancelAddParticipantBtn');
    
    // Remove old listeners by cloning
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add fresh listeners
    document.getElementById('closeAddParticipantBtn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeAddParticipantModal();
    });
    
    document.getElementById('cancelAddParticipantBtn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeAddParticipantModal();
    });
    
    document.getElementById('addParticipantForm').addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleAddParticipantSubmit(e);
    });
    
    // Show modal
    modal.classList.add('active');
}

function closeAddParticipantModal() {
    const modal = document.getElementById('addParticipantModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('addParticipantForm').reset();
    }
}

function handleAddParticipantSubmit(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const customerId = document.getElementById('addParticipantCustomerId').value;
    const name = document.getElementById('addParticipantName').value.trim();
    const role = document.getElementById('addParticipantRole').value.trim();
    const email = document.getElementById('addParticipantEmail').value.trim();
    const phone = document.getElementById('addParticipantPhone').value.trim();
    const meetingId = document.getElementById('addParticipantMeetingId').value;
    
    if (!name) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Name is required', 'error');
        return false;
    }
    
    const newParticipant = {
        name: name,
        role: role,
        email: email,
        phone: phone
    };
    
    // Create unique key for this participant
    const key = email && email.trim() 
        ? email.toLowerCase().trim() 
        : name.toLowerCase().trim();
    
    // Check if we should add to a specific meeting
   if (meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (meeting) {
        if (!meeting.participants) {
            meeting.participants = [];
        }
        
        // Check if participant already exists in this meeting
        const exists = meeting.participants.some(p => {
            const pKey = p.email && p.email.trim() 
                ? p.email.toLowerCase().trim() 
                : p.name.toLowerCase().trim();
            return pKey === key;
        });
        
        if (exists) {
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> This person is already in that meeting', 'error');
            return false;
        }
        
        meeting.participants.push(newParticipant);
        saveData();
        closeAddParticipantModal();
        showCustomerParticipantsSection(customerId);
        showCustomerMeetingsSection(customerId);  // <-- ADD THIS LINE
        showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> ${name} added to meeting!`, 'success');
    }
} else {
        // Save as standalone contact for this customer
        const customer = state.customers.find(c => c.id === customerId);
        if (!customer) {
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Customer not found', 'error');
            return false;
        }
        
        // Initialize participants array if it doesn't exist
        if (!customer.participants) {
            customer.participants = [];
        }
        
        // Check if participant already exists for this customer
        const exists = customer.participants.some(p => {
            const pKey = p.email && p.email.trim() 
                ? p.email.toLowerCase().trim() 
                : p.name.toLowerCase().trim();
            return pKey === key;
        });
        
        if (exists) {
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> This contact already exists', 'error');
            return false;
        }
        
        customer.participants.push(newParticipant);
        saveData();
        closeAddParticipantModal();
        showCustomerParticipantsSection(customerId);
        showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> ${name} added as contact!`, 'success');
    }
    
    return false;
}



function editParticipantFromOverview(participantKey, customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // First check standalone contacts
    let participant = null;
    if (customer.participants) {
        participant = customer.participants.find(p => {
            const key = p.email && p.email.trim() 
                ? p.email.toLowerCase().trim() 
                : p.name.toLowerCase().trim();
            return key === participantKey;
        });
    }
    
    // If not found, check meetings
    if (!participant) {
        const customerMeetings = state.meetings.filter(m => m.customerId === customerId);
        for (let meeting of customerMeetings) {
            if (meeting.participants) {
                participant = meeting.participants.find(p => {
                    const key = p.email && p.email.trim() 
                        ? p.email.toLowerCase().trim() 
                        : p.name.toLowerCase().trim();
                    return key === participantKey;
                });
                if (participant) break;
            }
        }
    }
    
    if (!participant) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Participant not found', 'error');
        return;
    }
    
    // Populate form
    document.getElementById('editParticipantCustomerId').value = customerId;
    document.getElementById('editParticipantOriginalEmail').value = participantKey;
    document.getElementById('editParticipantName').value = participant.name;
    document.getElementById('editParticipantRole').value = participant.role || '';
    document.getElementById('editParticipantEmail').value = participant.email || '';
    document.getElementById('editParticipantPhone').value = participant.phone || '';
    
    // Set up event listeners for this modal instance
    const modal = document.getElementById('participantEditModal');
    const closeBtn = document.getElementById('closeParticipantEditBtn');
    const cancelBtn = document.getElementById('cancelParticipantEditBtn');
    const form = document.getElementById('participantEditForm');
    
    // Remove old listeners by cloning
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add fresh listeners
    document.getElementById('closeParticipantEditBtn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeParticipantEditModal();
    });
    
    document.getElementById('cancelParticipantEditBtn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeParticipantEditModal();
    });
    
    document.getElementById('participantEditForm').addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handleParticipantEditSubmit(e);
    });
    
    // Show modal
    modal.classList.add('active');
}

function closeParticipantEditModal() {
    const modal = document.getElementById('participantEditModal');
    if (modal) {
        modal.classList.remove('active');
        // Reset form
        document.getElementById('participantEditForm').reset();
    }
}

function handleParticipantEditSubmit(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const customerId = document.getElementById('editParticipantCustomerId').value;
    const originalKey = document.getElementById('editParticipantOriginalEmail').value;
    const newName = document.getElementById('editParticipantName').value.trim();
    const newRole = document.getElementById('editParticipantRole').value.trim();
    const newEmail = document.getElementById('editParticipantEmail').value.trim();
    const newPhone = document.getElementById('editParticipantPhone').value.trim();
    
    if (!newName) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Name is required', 'error');
        return false;
    }
    
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return false;
    
    let updated = 0;
    
    // Update standalone contacts
    if (customer.participants) {
        customer.participants.forEach(participant => {
            const key = participant.email && participant.email.trim() 
                ? participant.email.toLowerCase().trim() 
                : participant.name.toLowerCase().trim();
            if (key === originalKey) {
                participant.name = newName;
                participant.role = newRole;
                participant.email = newEmail;
                participant.phone = newPhone;
                updated++;
            }
        });
    }
    
    // Update participant in all meetings for this customer
    state.meetings.forEach(meeting => {
        if (meeting.customerId === customerId && meeting.participants) {
            meeting.participants.forEach(participant => {
                const key = participant.email && participant.email.trim() 
                    ? participant.email.toLowerCase().trim() 
                    : participant.name.toLowerCase().trim();
                if (key === originalKey) {
                    participant.name = newName;
                    participant.role = newRole;
                    participant.email = newEmail;
                    participant.phone = newPhone;
                    updated++;
                }
            });
        }
    });
    
if (updated > 0) {
    saveData();
    closeParticipantEditModal();
    showCustomerParticipantsSection(customerId);
    showCustomerMeetingsSection(customerId);
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Participant updated!', 'success');
} else {
    showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> No records found to update', 'error');
}
    
    return false;
}

function deleteParticipantFromOverview(participantKey, customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    let totalInstances = 0;
    
    // Count standalone contacts
    if (customer.participants) {
        const standaloneExists = customer.participants.some(p => {
            const key = p.email && p.email.trim() 
                ? p.email.toLowerCase().trim() 
                : p.name.toLowerCase().trim();
            return key === participantKey;
        });
        if (standaloneExists) totalInstances++;
    }
    
    // Count meetings with this participant
    const customerMeetings = state.meetings.filter(m => m.customerId === customerId);
    customerMeetings.forEach(meeting => {
        if (meeting.participants) {
            const hasParticipant = meeting.participants.some(p => {
                const key = p.email && p.email.trim() 
                    ? p.email.toLowerCase().trim() 
                    : p.name.toLowerCase().trim();
                return key === participantKey;
            });
            if (hasParticipant) totalInstances++;
        }
    });
    
    const message = totalInstances > 1 
        ? `Remove this participant from ${totalInstances} location(s)?`
        : 'Remove this participant?';
    
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete Participant?', message, () => {
        // Remove from standalone contacts
        if (customer.participants) {
            customer.participants = customer.participants.filter(p => {
                const key = p.email && p.email.trim() 
                    ? p.email.toLowerCase().trim() 
                    : p.name.toLowerCase().trim();
                return key !== participantKey;
            });
        }
        
        // Remove participant from all meetings
        state.meetings.forEach(meeting => {
            if (meeting.customerId === customerId && meeting.participants) {
                meeting.participants = meeting.participants.filter(p => {
                    const key = p.email && p.email.trim() 
                        ? p.email.toLowerCase().trim() 
                        : p.name.toLowerCase().trim();
                    return key !== participantKey;
                });
            }
        });
        
        saveData();
        showCustomerParticipantsSection(customerId);
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Participant deleted!', 'success');
    });
}

// Consolidated Notes Functions
function openConsolidatedNotesModal(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const now = new Date();
    
    // Get meetings for current tab - ONLY PAST OR COMPLETED MEETINGS
    let meetings = [];
    if (state.currentMeetingTab === 'all') {
        meetings = state.meetings.filter(m => {
            if (m.customerId !== customerId) return false;
            
            // Show if explicitly marked as past meeting
            if (m.isPastMeeting) return true;
            
            // Or if meeting has already ended
            const meetingDate = new Date(m.date);
            const meetingDuration = m.duration || 60;
            const meetingEndTime = new Date(meetingDate.getTime() + meetingDuration * 60000);
            
            return meetingEndTime < now;
        });
    } else if (state.currentMeetingTab === 'individual') {
        meetings = state.meetings.filter(m => {
            if (m.customerId !== customerId) return false;
            if (m.tabId && m.tabId !== 'individual') return false;
            
            // Show if explicitly marked as past meeting
            if (m.isPastMeeting) return true;
            
            // Or if meeting has already ended
            const meetingDate = new Date(m.date);
            const meetingDuration = m.duration || 60;
            const meetingEndTime = new Date(meetingDate.getTime() + meetingDuration * 60000);
            
            return meetingEndTime < now;
        });
    } else {
        meetings = state.meetings.filter(m => {
            if (m.customerId !== customerId) return false;
            if (m.tabId !== state.currentMeetingTab) return false;
            
            // Show if explicitly marked as past meeting
            if (m.isPastMeeting) return true;
            
            // Or if meeting has already ended
            const meetingDate = new Date(m.date);
            const meetingDuration = m.duration || 60;
            const meetingEndTime = new Date(meetingDate.getTime() + meetingDuration * 60000);
            
            return meetingEndTime < now;
        });
    }
    
    // Sort by date (newest first)
    meetings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update modal title
    const tabName = state.meetingTabs.find(t => t.id === state.currentMeetingTab)?.name || 'All Meetings';
    document.getElementById('consolidatedNotesTitle').innerHTML = `<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> ${tabName} - ${customer.name}`;
    
    // Render consolidated notes
    renderConsolidatedNotes(meetings, customer.name);
    
    // Set up modal tabs
    document.querySelectorAll('#consolidatedNotesModal .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#consolidatedNotesModal .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('#consolidatedNotesModal .modal-tab[data-tab="view"]').classList.add('active');
    document.querySelector('#consolidatedNotesModal [data-tab-content="view"]').classList.add('active');
    
    // Show modal
    document.getElementById('consolidatedNotesModal').classList.add('active');
}

function toggleModalFullscreen(modalId, btnId) {
    const modal = document.getElementById(modalId);
    const modalContent = modal.querySelector('.modal-content');
    const btn = document.getElementById(btnId);
    
    modalContent.classList.toggle('fullscreen');
    btn.innerHTML = modalContent.classList.contains('fullscreen') ? '<span class="icon icon-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span> Close' : '<span class="icon icon-maximize"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></span> Expand';
}

function closeConsolidatedNotesModal() {
    const modal = document.getElementById('consolidatedNotesModal');
    const modalContent = modal.querySelector('.modal-content');
    const btn = document.getElementById('consolidatedNotesFullscreenBtn');
    
    // Reset fullscreen state when closing
    modalContent.classList.remove('fullscreen');
    if (btn) btn.innerHTML = '<span class="icon icon-maximize"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></span> Expand';
    
    modal.classList.remove('active');
}

function renderConsolidatedNotes(meetings, customerName) {
    const container = document.getElementById('consolidatedNotesContent');
    
    if (meetings.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><span class="icon icon-inbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg></span></div><div>No meetings</div></div>';
        return;
    }
    
const typeIcons = {
    discovery: '<span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>',
    'follow-up': '<span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>'
};
    
    container.innerHTML = meetings.map((meeting, index) => {
        const meetingDate = new Date(meeting.date);
        const notesText = meeting.notesHTML ? htmlToPlainText(meeting.notesHTML) : meeting.notes || '';
        const nextStepsText = meeting.nextStepsHTML ? htmlToPlainText(meeting.nextStepsHTML) : meeting.nextSteps || '';
        const typeIcon = typeIcons[meeting.type] || '<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span>';
        
        return `
            <div class="consolidated-meeting-block">
                <div class="consolidated-meeting-header">
                    <div class="consolidated-meeting-title">
                        ${index + 1}. ${escapeHtml(meeting.title)}
                    </div>
                    <div class="consolidated-meeting-meta">
                        <div class="consolidated-meeting-meta-item">
                            <span><span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span></span>
                            <span>${meetingDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        ${meeting.type ? `
                            <div class="consolidated-meeting-meta-item">
                                <span>${typeIcon}</span>
                                <span>${meeting.type.replace('-', ' ')}</span>
                            </div>
                        ` : ''}
                        ${meeting.duration ? `
                            <div class="consolidated-meeting-meta-item">
                                <span<span class="icon icon-clock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span></span>
                                <span>${meeting.duration} min</span>
                            </div>
                        ` : ''}
                        ${meeting.outcome ? `
                            <div class="consolidated-meeting-meta-item">
                                <span><span class="icon icon-target"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span></span>
                                <span>${meeting.outcome}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${meeting.participants && meeting.participants.length > 0 ? `
                    <div class="consolidated-meeting-participants">
                        <div class="consolidated-meeting-participants-title"><span class="icon icon-users"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span> Participants</div>
                        ${meeting.participants.map(p => `
                            <div class="consolidated-participant-item">
                                <div class="consolidated-participant-name">${escapeHtml(p.name)}</div>
                                ${p.role || p.email || p.phone ? `
                                    <div class="consolidated-participant-details">
                                        ${p.role ? escapeHtml(p.role) : ''}
                                        ${p.email ? ` • ${escapeHtml(p.email)}` : ''}
                                        ${p.phone ? ` • ${escapeHtml(p.phone)}` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${notesText ? `
                    <div class="consolidated-meeting-notes">${escapeHtml(notesText)}</div>
                ` : `
                    <div class="consolidated-meeting-notes" style="font-style: italic; opacity: 0.6;">No notes recorded</div>
                `}
                
                ${nextStepsText ? `
                    <div class="consolidated-meeting-nextsteps">
                        <div class="consolidated-meeting-nextsteps-title">Next Steps</div>
                        <div class="consolidated-meeting-nextsteps-content">${escapeHtml(nextStepsText)}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    // Update export preview
    updateConsolidatedNotesExport(meetings, customerName);
}

function updateConsolidatedNotesExport(meetings, customerName) {
    const tabName = state.meetingTabs.find(t => t.id === state.currentMeetingTab)?.name || 'All Meetings';
    
    let exportText = `CONSOLIDATED MEETING NOTES\n`;
    exportText += `${'='.repeat(60)}\n\n`;
    exportText += `Customer: ${customerName}\n`;
    exportText += `Tab: ${tabName}\n`;
    exportText += `Total Meetings: ${meetings.length}\n`;
    exportText += `Export Date: ${new Date().toLocaleString()}\n\n`;
    exportText += `${'='.repeat(60)}\n\n`;
    
const typeIcons = {
    discovery: '<span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>',
    'follow-up': '<span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>'
};
    
    meetings.forEach((meeting, index) => {
        const meetingDate = new Date(meeting.date);
        const notesText = meeting.notesHTML ? htmlToPlainText(meeting.notesHTML) : meeting.notes || '';
        const nextStepsText = meeting.nextStepsHTML ? htmlToPlainText(meeting.nextStepsHTML) : meeting.nextSteps || '';
        
        exportText += `MEETING ${index + 1}: ${meeting.title}\n`;
        exportText += `${'-'.repeat(60)}\n\n`;
        exportText += `Date: ${meetingDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}\n`;
        if (meeting.type) exportText += `Type: ${meeting.type.replace('-', ' ')}\n`;
        if (meeting.duration) exportText += `Duration: ${meeting.duration} min\n`;
        if (meeting.outcome) exportText += `Outcome: ${meeting.outcome}\n`;
        exportText += `\n`;
        
        if (meeting.participants && meeting.participants.length > 0) {
            exportText += `PARTICIPANTS:\n`;
            meeting.participants.forEach(p => {
                exportText += `• ${p.name}`;
                if (p.role) exportText += ` - ${p.role}`;
                if (p.email) exportText += ` (${p.email})`;
                if (p.phone) exportText += ` - ${p.phone}`;
                exportText += `\n`;
            });
            exportText += `\n`;
        }
        
        exportText += `NOTES:\n`;
        exportText += notesText || 'No notes recorded';
        exportText += `\n\n`;
        
        if (nextStepsText) {
            exportText += `NEXT STEPS:\n`;
            exportText += nextStepsText;
            exportText += `\n\n`;
        }
        
        exportText += `${'='.repeat(60)}\n\n`;
    });
    
    document.getElementById('consolidatedNotesExportPreview').textContent = exportText;
}

function copyConsolidatedNotes() {
    const exportText = document.getElementById('consolidatedNotesExportPreview').textContent;
    navigator.clipboard.writeText(exportText).then(() => {
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Copied all notes!', 'success');
    }).catch(() => {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed to copy', 'error');
    });
}

function downloadConsolidatedNotes() {
    const exportText = document.getElementById('consolidatedNotesExportPreview').textContent;
    const customer = state.customers.find(c => c.id === state.currentCustomer);
    const tabName = state.meetingTabs.find(t => t.id === state.currentMeetingTab)?.name || 'AllMeetings';
    const filename = `${customer.name.replace(/\s+/g, '_')}_${tabName.replace(/\s+/g, '_')}_Notes_${new Date().toISOString().split('T')[0]}.txt`;
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Downloaded!', 'success');
}

// ========== MONETIZATION FUNCTIONS - START ==========
const PLAN_LIMITS = { free: 6, starter: 15, pro: 50, unlimited: Infinity };

function getCustomerLimit() { return PLAN_LIMITS[state.subscription.plan] || 6; }

function canAddCustomer() { return state.customers.length < getCustomerLimit(); }

function canEditCustomer(customerId) {
    if (state.subscription.status !== 'active' && state.subscription.plan !== 'free') {
        const sortedCustomers = [...state.customers].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const customerIndex = sortedCustomers.findIndex(c => c.id === customerId);
        return customerIndex < 6;
    }
    const limit = getCustomerLimit();
    if (limit === Infinity) return true;
    const sortedCustomers = [...state.customers].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const customerIndex = sortedCustomers.findIndex(c => c.id === customerId);
    return customerIndex < limit;
}

function isCustomerFrozen(customerId) { return !canEditCustomer(customerId); }

function renderCustomerSlots() {
    const container = document.getElementById('customerSlotsContainer');
    const fill = document.getElementById('customerSlotsFill');
    const count = document.getElementById('customerSlotsCount');
    const limit = getCustomerLimit();
    container.style.display = 'block';
    const used = state.customers.length;

    if (limit === Infinity) {
        fill.style.width = '100%';
        fill.className = 'customer-slots-fill normal';
        count.textContent = used + ' customers (Unlimited)';
    } else {
        const pct = Math.min((used / limit) * 100, 100);
        fill.style.width = pct + '%';
        fill.className = 'customer-slots-fill ' + 
            (used >= limit ? 'limit' : used >= limit - 1 ? 'warning' : 'normal');
        count.textContent = used + ' of ' + limit;
    }

 // Show reactivation warning with clickable link
    if (state.subscription.cancelAt) {
        const cancelDate = new Date(state.subscription.cancelAt);
        const formattedDate = cancelDate.toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric' 
        });
        const daysLeft = Math.ceil((cancelDate - new Date()) / (1000 * 60 * 60 * 24));
        
        count.innerHTML = count.textContent + 
            ` <span style="color: var(--warning); font-weight: 700;">• Ends ${formattedDate} (${daysLeft}d)</span>`;

 // Add reactivate button below the slots bar
        let reactivateBtn = document.getElementById('reactivatePlanBtn');
        if (!reactivateBtn) {
            reactivateBtn = document.createElement('div');
            reactivateBtn.id = 'reactivatePlanBtn';
            reactivateBtn.style.cssText = 'margin-top: 0.5rem; text-align: center;';
            container.appendChild(reactivateBtn);
        }
        reactivateBtn.innerHTML = `
            <button onclick="reactivateSubscription()" style="
                background: linear-gradient(135deg, #023747 0%, #1ba8af 100%);
                color: white;
                border: none;
                padding: 0.35rem 0.75rem;
                border-radius: 6px;
                font-size: 0.65rem;
                font-weight: 700;
                cursor: pointer;
                width: 100%;
                transition: all 0.2s;
            " onmouseover="this.style.opacity='0.9'"
               onmouseout="this.style.opacity='1'">
                <span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Reactivate Plan
            </button>
        `;
    } else {
 // Remove reactivate button if not cancelling
        const reactivateBtn = document.getElementById('reactivatePlanBtn');
        if (reactivateBtn) reactivateBtn.remove();
    }
}

        
function openUpgradeModal() { document.getElementById('upgradeModal').classList.add('active'); updatePlanCards(); }
function closeUpgradeModal() { document.getElementById('upgradeModal').classList.remove('active'); }

function updatePlanCards() {
    const planRank = { free: 0, starter: 1, pro: 2, unlimited: 3 };
    const currentRank = planRank[state.subscription.plan] || 0;

    document.querySelectorAll('.plan-card').forEach(card => {
        const plan = card.dataset.plan;
        const btn = card.querySelector('.plan-btn');
        const selectedRank = planRank[plan] || 0;

        card.classList.remove('current');

        if (plan === state.subscription.plan) {
            card.classList.add('current');
            btn.className = 'plan-btn secondary';
            btn.style.cursor = 'default';
            btn.style.opacity = '0.7';
            btn.onclick = null;

 // Show reactivate button if cancelling
            if (state.subscription.cancelAt) {
                btn.innerHTML = '<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Reactivate';
                btn.className = 'plan-btn primary';
                btn.style.cursor = 'pointer';
                btn.style.opacity = '1';
                btn.onclick = async () => {
                    closeUpgradeModal();
                    await reactivateSubscription();
                };
            } else {
                btn.textContent = 'Current Plan';
            }

        } else if (selectedRank < currentRank) {
            btn.className = 'plan-btn secondary';
            btn.textContent = '—';
            btn.onclick = null;
            btn.style.cursor = 'default';
            btn.style.opacity = '0.4';

        } else {
            btn.className = 'plan-btn primary';
            btn.textContent = 'Upgrade';
            btn.style.cursor = 'pointer';
            btn.style.opacity = '1';
            btn.onclick = () => selectPlan(plan);
        }
    });

 // Manage subscription button area
    let manageDiv = document.getElementById('manageSubscriptionDiv');

    if (state.subscription.plan !== 'free') {
        if (!manageDiv) {
            manageDiv = document.createElement('div');
            manageDiv.id = 'manageSubscriptionDiv';
            manageDiv.style.cssText = 'text-align:center;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)';
            document.querySelector('.upgrade-modal-content').appendChild(manageDiv);
        }

 // Show different button based on cancellation state
        if (state.subscription.cancelAt) {
            const cancelDate = new Date(state.subscription.cancelAt);
            const formattedDate = cancelDate.toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric'
            });
            const daysLeft = Math.ceil((cancelDate - new Date()) / (1000 * 60 * 60 * 24));

            manageDiv.innerHTML = `
                <div style="
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                ">
                    <div style="font-size: 0.85rem; color: var(--warning); font-weight: 700; margin-bottom: 0.5rem;">
                        <span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Your plan ends on ${formattedDate} (${daysLeft} days left)
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">
                        You still have full access until then. Reactivate to keep your plan.
                    </div>
                </div>
                <button onclick="closeUpgradeModal(); reactivateSubscription();" style="
                    background: linear-gradient(135deg, #023747 0%, #1ba8af 100%);
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 0.85rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 700;
                    width: 100%;
                    transition: all 0.2s;
                " onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'"
                   onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'">
                    <span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Reactivate My Plan
                </button>
            `;
        } else {
            manageDiv.innerHTML = `
                <button onclick="openManageSubscription()" style="
                    background: transparent;
                    border: 1px solid var(--danger);
                    color: var(--danger);
                    cursor: pointer;
                    font-size: 0.85rem;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                " onmouseover="this.style.background='var(--danger)';this.style.color='white'" 
                   onmouseout="this.style.background='transparent';this.style.color='var(--danger)'">
                    Cancel Subscription
                </button>
            `;
        }
    } else if (manageDiv) {
        manageDiv.remove();
    }
}


async function cancelSubscription() {
    try {
        const getPortal = firebase.functions().httpsCallable('createStripePortal');
        const result = await getPortal({ userId: auth.currentUser.uid });
        window.location.href = result.data.url; // Stripe handles cancel/upgrade UI
    } catch (error) {
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed: ' + error.message, 'error');
    }
}

async function openManageSubscription() {
    if (!auth.currentUser) {
        showToast('Please sign in first', 'error');
        return;
    }

    closeUpgradeModal();

    const planName = state.subscription.plan.charAt(0).toUpperCase() + state.subscription.plan.slice(1);
    const billing = state.subscription.billing || 'monthly';
    const billingLabel = billing === 'annual' ? 'year' : 'month';

    // Check if already set to cancel
    if (state.subscription.cancelAt) {
        const cancelDate = new Date(state.subscription.cancelAt);
        const formattedDate = cancelDate.toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>';
        document.getElementById('confirmTitle').textContent = 'Subscription Ending';
        document.getElementById('confirmMessage').innerHTML = `
            <div style="text-align: left;">
                <p style="margin-bottom: 0.75rem;">
                    Your <strong>${planName}</strong> plan is set to cancel.
                </p>
                <p style="margin-bottom: 0.75rem;">
                    You have full access until: <br>
                    <strong style="font-size: 1.1rem; color: var(--primary);">${formattedDate}</strong>
                </p>
                <p style="margin-bottom: 0.75rem; color: var(--text-secondary); font-size: 0.85rem;">
                    After this date you'll be moved to the Free plan (6 customers).
                </p>
                <p style="font-size: 0.85rem; color: var(--success);">
                    Changed your mind? You can reactivate below.
                </p>
            </div>
        `;

        const cancelBtn = document.getElementById('cancelConfirmBtn');
        cancelBtn.style.display = '';
        cancelBtn.textContent = 'Close';
        cancelBtn.className = 'btn btn-secondary';

        const confirmBtn = document.getElementById('confirmBtn');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.innerHTML = '<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Reactivate Plan';
        newConfirmBtn.className = 'btn btn-primary';

        newConfirmBtn.addEventListener('click', async () => {
            document.getElementById('confirmModal').classList.remove('active');
            await reactivateSubscription();
        });

        state.confirmCallback = null;
        document.getElementById('confirmModal').classList.add('active');
        return;
    }

    // Normal cancel flow
    document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>';
    document.getElementById('confirmTitle').textContent = 'Cancel Subscription?';
    document.getElementById('confirmMessage').innerHTML = `
        <div style="text-align: left;">
            <p style="margin-bottom: 0.75rem;">
                Your current plan: <strong>${planName}</strong> (${billingLabel}ly)
            </p>
            <p style="margin-bottom: 0.75rem;">
                If you cancel:
            </p>
            <ul style="margin-left: 1.5rem; margin-bottom: 0.75rem;">
                <li>You <strong>keep full access</strong> until the end of your current billing ${billingLabel}</li>
                <li>After that, you'll be moved to the <strong>Free plan</strong> (6 customers)</li>
                <li>Customers beyond the limit will become view-only</li>
            </ul>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
                You can reactivate anytime before the period ends.
            </p>
        </div>
    `;

    const cancelBtn = document.getElementById('cancelConfirmBtn');
    cancelBtn.style.display = '';
    cancelBtn.textContent = 'Keep My Plan';
    cancelBtn.className = 'btn btn-primary';

    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.innerHTML = '<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span> Cancel Subscription';
    newConfirmBtn.className = 'btn btn-danger';

    newConfirmBtn.addEventListener('click', async () => {
        document.getElementById('confirmModal').classList.remove('active');
        await performCancellation();
    });

    state.confirmCallback = null;
    document.getElementById('confirmModal').classList.add('active');
}

async function performCancellation() {
    const subscriptionId = state.subscription.stripeSubscriptionId;

    if (!subscriptionId) {
        // No Stripe ID — simulate end-of-period cancellation locally
        const endOfPeriod = new Date();
        endOfPeriod.setMonth(endOfPeriod.getMonth() + 1); // approximate 1 month
        
        state.subscription.status = 'cancelling';
        state.subscription.cancelAt = endOfPeriod.toISOString();
        
        saveSubscription();
        saveUserDataToFirestore();
        renderCustomerSlots();
        renderCustomerFilters();
        showCancellationSuccess(endOfPeriod.toISOString());
        return;
    }

    showToast('<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Cancelling subscription...', 'success');

    try {
        const response = await fetch('https://web-production-fcbb6.up.railway.app/cancel-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stripeSubscriptionId: subscriptionId,
                userId: auth.currentUser.uid
            }),
        });

        const data = await response.json();

        if (data.error) {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed to cancel: ' + data.error, 'error');
            return;
        }

        // Keep plan active but mark as cancelling
        state.subscription.status = 'cancelling';
        state.subscription.cancelAt = data.cancelAt;

        saveSubscription();
        saveUserDataToFirestore();
        renderCustomerSlots();
        renderCustomerFilters();

        showCancellationSuccess(data.cancelAt);

    } catch (err) {
        console.error('Cancel error:', err);
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed to cancel. Please try again.', 'error');
    }
}

function showCancellationSuccess(cancelAt) {
    const formattedDate = cancelAt 
        ? new Date(cancelAt).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          })
        : 'now';

    document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>';
    document.getElementById('confirmTitle').textContent = 'Subscription Cancelled';
    document.getElementById('confirmMessage').innerHTML = `
        <div style="text-align: center;">
            ${cancelAt ? `
                <p style="margin-bottom: 0.75rem;">
                    Your subscription has been cancelled.
                </p>
                <p style="margin-bottom: 0.75rem;">
                    You have <strong>full access</strong> until:
                </p>
                <p style="font-size: 1.2rem; font-weight: 700; color: var(--primary); margin-bottom: 0.75rem;">
                    ${formattedDate}
                </p>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">
                    After this date you'll be on the Free plan.<br>
                    You can reactivate anytime before then.
                </p>
            ` : `
                <p style="margin-bottom: 0.75rem;">
                    Your subscription has been cancelled.
                </p>
                <p>You are now on the <strong>Free plan</strong>.</p>
            `}
        </div>
    `;

    const cancelBtn = document.getElementById('cancelConfirmBtn');
    cancelBtn.style.display = 'none';

    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.textContent = 'OK';
    newConfirmBtn.className = 'btn btn-primary';
    newConfirmBtn.addEventListener('click', () => {
        document.getElementById('confirmModal').classList.remove('active');
        document.getElementById('cancelConfirmBtn').style.display = '';
        document.getElementById('cancelConfirmBtn').textContent = 'Cancel';
        document.getElementById('cancelConfirmBtn').className = 'btn btn-secondary';
    });

    state.confirmCallback = null;
    document.getElementById('confirmModal').classList.add('active');
}

async function reactivateSubscription() {
    const subscriptionId = state.subscription.stripeSubscriptionId;
    const cancelAt = state.subscription.cancelAt;
    const now = new Date();

 // Check if subscription period has already ended
    if (cancelAt && new Date(cancelAt) <= now) {
        // Subscription is deleted on Stripe — need new checkout
        showConfirm(
            '<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>',
            'Subscription Expired',
            'Your subscription has already ended. You will need to re-subscribe with your payment details.',
            async () => {
                closeUpgradeModal();
 // Reset local state first
                state.subscription = {
                    plan: 'free',
                    status: 'active',
                    cancelAt: null,
                    stripeCustomerId: null,
                    stripeSubscriptionId: null,
                    periodEnd: null
                };
                await saveSubscription();
                await saveUserDataToFirestore();
                renderCustomerSlots();
                renderCustomerFilters();
 // Send to new checkout
                openUpgradeModal();
            }
        );
        return;
    }

 // Check if we have what we need
    if (!subscriptionId) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> No active subscription found', 'error');
        return;
    }

    if (!auth.currentUser) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Please sign in first', 'error');
        openAuthModal();
        return;
    }

    showToast('<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Reactivating your plan...', 'success');

    try {
        const response = await fetch(
            'https://web-production-fcbb6.up.railway.app/reactivate-subscription',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stripeSubscriptionId: subscriptionId,
                    userId: auth.currentUser.uid
                }),
            }
        );

 // Check HTTP status before parsing
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
 // Handle subscription not found on Stripe
            if (response.status === 404 || 
                errorData.error?.includes('No such subscription')) {
                showToast(
                    '<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Subscription not found. Please re-subscribe.', 
                    'error'
                );
                // Reset to free and open upgrade modal
                state.subscription = {
                    plan: 'free',
                    status: 'active',
                    cancelAt: null,
                    stripeCustomerId: null,
                    stripeSubscriptionId: null
                };
                await saveSubscription();
                await saveUserDataToFirestore();
                renderCustomerSlots();
                renderCustomerFilters();
                updatePlanCards();
                openUpgradeModal();
                return;
            }
            
            throw new Error(errorData.error || 'Reactivation failed');
        }

        const data = await response.json();

        if (data.error) {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed: ' + data.error, 'error');
            return;
        }

 // Verify Stripe confirmed the reactivation
        if (!data.success && !data.subscription) {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Reactivation not confirmed by Stripe', 'error');
            return;
        }

 // Update state ONLY after Stripe confirms
        state.subscription.status = 'active';
        state.subscription.cancelAt = null;
        
 // Update periodEnd if Stripe returns it
        if (data.periodEnd) {
            state.subscription.periodEnd = data.periodEnd;
        }

 // Save to both localStorage and Firestore
        await saveSubscription();
        await saveUserDataToFirestore();

 // Full UI refresh
        renderCustomerSlots();
        renderCustomerFilters();
        updatePlanCards();

        if (state.currentCustomer !== 'all') {
            updateFrozenBanner();
        }

        const reactivateBtn = document.getElementById('reactivatePlanBtn');
        if (reactivateBtn) reactivateBtn.remove();

        if (document.getElementById('upcomingMeetingsSection')
            .classList.contains('active')) {
            renderUpcomingMeetings();
        }
        if (document.getElementById('allCustomersSection')
            .classList.contains('active')) {
            renderAllCustomersList();
        }

        const planName = state.subscription.plan.charAt(0).toUpperCase() + 
                        state.subscription.plan.slice(1);

 // Show success with next billing date
        const nextBillingDate = state.subscription.periodEnd 
            ? new Date(state.subscription.periodEnd * 1000)
                .toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                })
            : null;

        document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>';
        document.getElementById('confirmTitle').textContent = 'Plan Reactivated!';
        document.getElementById('confirmMessage').innerHTML = `
            <div style="text-align: center;">
                <p style="margin-bottom: 0.75rem;">
                    Your <strong>${planName}</strong> plan is back on!
                </p>
                ${nextBillingDate ? `
                    <p style="margin-bottom: 0.75rem; 
                               font-size: 0.85rem; 
                               color: var(--text-secondary);">
                        Next billing date:<br>
                        <strong style="color: var(--primary);">
                            ${nextBillingDate}
                        </strong>
                    </p>
                ` : ''}
                <p style="font-size: 0.85rem; color: var(--text-secondary);">
                    No new payment needed — your existing 
                    payment method will be used.
                </p>
            </div>
        `;

        const cancelBtn = document.getElementById('cancelConfirmBtn');
        cancelBtn.style.display = 'none';

        const confirmBtn = document.getElementById('confirmBtn');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.textContent = 'Great!';
        newConfirmBtn.className = 'btn btn-primary';
        newConfirmBtn.addEventListener('click', () => {
            document.getElementById('confirmModal').classList.remove('active');
            document.getElementById('cancelConfirmBtn').style.display = '';
            document.getElementById('cancelConfirmBtn').textContent = 'Cancel';
            document.getElementById('cancelConfirmBtn').className = 
                'btn btn-secondary';
        });

        document.getElementById('confirmModal').classList.add('active');

    } catch (err) {
        console.error('Reactivate error:', err);
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed to reactivate: ' + err.message, 'error');
    }
}

        

        
async function selectPlan(plan) {
    const planRank = { free: 0, starter: 1, pro: 2, unlimited: 3 };
    const currentRank = planRank[state.subscription.plan] || 0;
    const selectedRank = planRank[plan] || 0;

    if (selectedRank <= currentRank) {
        openManageSubscription();
        return;
    }

 // Block upgrade if not signed in
    if (!auth.currentUser) {
        closeUpgradeModal();
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Please sign in to upgrade', 'error');
        setTimeout(() => openAuthModal(), 500);
        return;
    }

    const billing = currentBilling || 'monthly';
    const userEmail = auth.currentUser.email;
    const userId = auth.currentUser.uid;

    showToast('Redirecting to checkout...', 'success');

    try {
        const response = await fetch(
            'https://web-production-fcbb6.up.railway.app/create-checkout-session', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, billing, userId, userEmail }),
            }
        );

        const data = await response.json();

        if (data.error) {
            showToast('Checkout error: ' + data.error, 'error');
            return;
        }

        window.location.href = data.url;

    } catch (err) {
        console.error('Stripe error:', err);
        showToast('Could not connect to payment server.', 'error');
    }
}


const planPrices = { free: 0, starter: 9, pro: 19, unlimited: 29 };

function setBilling(type) {
    currentBilling = type;
    document.querySelectorAll('.billing-toggle button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.plan-card').forEach(card => {
        const plan = card.dataset.plan;
        const price = planPrices[plan];
        if (price === undefined) return;
        const displayPrice = type === 'annual' ? Math.round(price * 0.8) : price;
        const priceEl = card.querySelector('.plan-price');
        if (priceEl) priceEl.innerHTML = `$${displayPrice}<span>/mo</span>`;
    });
}


function updateFrozenBanner() {
    const banner = document.getElementById('frozenBanner');
    if (state.currentCustomer && state.currentCustomer !== 'all' && isCustomerFrozen(state.currentCustomer)) {
        banner.style.display = 'flex';
    } else {
        banner.style.display = 'none';
    }
}

function showLimitReachedModal() {
    document.getElementById('confirmIcon').textContent = '';
    document.getElementById('confirmTitle').textContent = 'Customer Limit Reached';
    document.getElementById('confirmMessage').textContent = 'You have used all ' + getCustomerLimit() + ' customer slots on your current plan. Upgrade to add more customers.';
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.textContent = 'View Plans';
    confirmBtn.className = 'btn btn-primary';
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.addEventListener('click', () => { document.getElementById('confirmModal').classList.remove('active'); openUpgradeModal(); });
    document.getElementById('cancelConfirmBtn').textContent = 'Maybe Later';
    document.getElementById('confirmModal').classList.add('active');
}

function saveSubscription() { 
    localStorage.setItem('cnotes_subscription', JSON.stringify(state.subscription));
    
    if (auth.currentUser) {
 // Return the promise so it can be awaited
        return db.collection('users').doc(auth.currentUser.uid).set({
            subscription: state.subscription
        }, { merge: true }).catch(err => {
            console.error('Error saving subscription:', err);
        });
    }
    
 // Return resolved promise when no user
    return Promise.resolve();
}


        
function loadSubscription() { const s = localStorage.getItem('cnotes_subscription'); if (s) state.subscription = JSON.parse(s); }
// ========== MONETIZATION FUNCTIONS - END ==========

function checkSubscriptionExpiry() {
    if (state.subscription.cancelAt) {
        const cancelDate = new Date(state.subscription.cancelAt);
        const now = new Date();
        
        if (now >= cancelDate) {
            state.subscription.plan = 'free';
            state.subscription.status = 'active';
            state.subscription.stripeCustomerId = null;
            state.subscription.stripeSubscriptionId = null;
            state.subscription.cancelAt = null;
            state.subscription.periodEnd = null;
            
            saveSubscription();
            saveUserDataToFirestore();
            renderCustomerSlots();
            renderCustomerFilters();
            updatePlanCards();

            if (state.currentCustomer !== 'all') {
                updateFrozenBanner();
            }

            const reactivateBtn = document.getElementById('reactivatePlanBtn');
            if (reactivateBtn) reactivateBtn.remove();

 // Count frozen customers
            const frozenCount = state.customers.filter(c => 
                isCustomerFrozen(c.id)
            ).length;

            if (frozenCount > 0) {
                showFrozenCustomersWarning(frozenCount);
            } else {
                showToast(
                    'Your subscription has ended. You are now on the Free plan.', 
                    'success'
                );
            }
        }
    }
}

// NEW function — shows persistent warning
function showFrozenCustomersWarning(frozenCount) {
    // Remove existing warning if any
    const existing = document.getElementById('frozenWarningBanner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'frozenWarningBanner';
    banner.style.cssText = `
        background: linear-gradient(135deg, 
            rgba(245, 158, 11, 0.15), 
            rgba(245, 158, 11, 0.05));
        border: 1px solid rgba(245, 158, 11, 0.4);
        border-left: 4px solid #f59e0b;
        border-radius: 10px;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease-out;
    `;

    banner.innerHTML = `
        <div style="flex: 1;">
            <div style="
                font-weight: 700; 
                color: #f59e0b; 
                margin-bottom: 0.35rem;
                font-size: 0.9rem;
            ">
                <span class="icon icon-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> ${frozenCount} Customer${frozenCount !== 1 ? 's' : ''} 
                Now View-Only
            </div>
            <div style="
                font-size: 0.8rem; 
                color: var(--text-secondary);
                line-height: 1.5;
            ">
                Your plan ended. Your first 6 customers remain fully editable. 
                <strong>${frozenCount}</strong> customer${frozenCount !== 1 ? 's are' : ' is'} 
                now view-only — all data is safe and nothing was deleted.
                Upgrade to regain full access.
            </div>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
            <button onclick="openUpgradeModal()" style="
                background: linear-gradient(135deg, #023747 0%, #1ba8af 100%);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.8rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            " onmouseover="this.style.opacity='0.9'"
               onmouseout="this.style.opacity='1'">
                <span class="icon icon-arrow-up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></span> Upgrade
            </button>
            <button onclick="document.getElementById('frozenWarningBanner').remove()" 
                    style="
                background: transparent;
                border: 1px solid var(--border);
                color: var(--text-secondary);
                padding: 0.5rem;
                border-radius: 8px;
                font-size: 0.8rem;
                cursor: pointer;
            "><span class="icon icon-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span></button>
        </div>
    `;

 // Insert at top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(banner, mainContent.firstChild);
    }
}


        
function init() {
        // Show loader immediately
    document.getElementById('appLoader').classList.remove('hidden');
 loadSubscription();
     checkSubscriptionExpiry();
  fixDuplicateMeetingIds();
  setupShareModalTabs();
  setupSectionResize();
  setupEventListeners();
  setupColorPicker();
  setupCustomerCombobox();
  setupTaskCustomerCombobox();
  setupCustomerInfoCustomerCombobox();
  setupInlineTabs();
  loadCustomMeetingTypes();
  loadPrepTitles();
  setupRichTextEditor();
  setupMEDDPICCQuickAdd();
  setupActionItemQuickAdd();
  updateStats();
  renderCustomerFilters();
  renderNotes();
  showHome();

  // Reset state to ensure clean start
  state.currentCustomer = 'all';
  state.currentMeetingTab = 'all';

  // Show dashboard (will be called again by auth callback, but ensures immediate display)
  showDashboard();

  // Auto-refresh upcoming meetings every 30 seconds to update statuses
  setInterval(() => {
    if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
      renderUpcomingMeetings();
    }
  }, 30000);

  

}


        function setupEventListeners() {
            document.getElementById('homeBtn').addEventListener('click', () => showDashboard());
            document.getElementById('showAllTasksBtn').addEventListener('click', () => showAllTasks());

document.getElementById('exportAllBtn').addEventListener('click', exportAllData);
document.getElementById('importAllBtn').addEventListener('click', () => document.getElementById('importFileInput').click());
document.getElementById('importFileInput').addEventListener('change', importAllData);

// ========== SHARING FEATURE - START ==========
document.getElementById('sharedBtn').addEventListener('click', () => showSharedMeetings());
// Share modal close button
const closeShareBtn = document.getElementById('closeShareModalBtn');
if (closeShareBtn) {
    closeShareBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeShareModal();
    };
}
// ========== SHARING FEATURE - END ==========
// Setup upcoming meetings period filters
document.querySelectorAll('.upcoming-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.upcoming-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.upcomingMeetingsPeriod = btn.dataset.period === 'all' ? 'all' : parseInt(btn.dataset.period);
        renderUpcomingMeetings();
    });
});
            document.getElementById('newMeetingBtn').addEventListener('click', () => {
    // If viewing a specific customer, auto-fill with that customer
    if (state.currentCustomer !== 'all') {
        openInlineMeetingFormForCustomer(state.currentCustomer);
    } else {
        openInlineMeetingForm();
    }
});

document.getElementById('newCallBtn').addEventListener('click', () => {
    if (state.currentCustomer !== 'all') {
        openPhoneCallModal(state.currentCustomer);
    } else {
        openPhoneCallModal();
    }
});


            document.getElementById('newTaskBtn').addEventListener('click', () => openTaskModal());
            document.getElementById('newNoteBtn').addEventListener('click', () => openNoteModal());
document.getElementById('addCustomerBtn').addEventListener('click', () => openAddCustomerForm());
            document.getElementById('viewMeetingsBtn').addEventListener('click', () => openAllMeetingsModal());
            document.getElementById('tagsOverviewBtn').addEventListener('click', () => openTagsOverviewModal());
            document.getElementById('themeToggle').addEventListener('click', toggleTheme);
            document.getElementById('archiveBtn').addEventListener('click', () => showArchived());
            document.getElementById('clearAllBtn').addEventListener('click', () => showConfirm('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>', 'Clear All?', 'Delete everything?', confirmClearAll));

document.getElementById('closeConsolidatedNotesBtn').addEventListener('click', closeConsolidatedNotesModal);
document.getElementById('copyConsolidatedNotesBtn').addEventListener('click', copyConsolidatedNotes);
document.getElementById('downloadConsolidatedNotesBtn').addEventListener('click', downloadConsolidatedNotes);
            
            document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
            document.getElementById('noteForm').addEventListener('submit', handleNoteSubmit);
            document.getElementById('customerForm').addEventListener('submit', handleCustomerSubmit);
            document.getElementById('meetingForm').addEventListener('submit', handleMeetingSubmit);
            document.getElementById('CustomerInfoForm').addEventListener('submit', handleCustomerInfoSubmit);
            
            document.getElementById('searchInput').addEventListener('input', handleSearch);

            document.getElementById('closeCustomersModalBtn').addEventListener('click', closeCustomersModal);
            document.getElementById('closeCustomerFormBtn').addEventListener('click', closeCustomerFormModal);
document.getElementById('closeCustomMeetingTypeBtn').addEventListener('click', closeCustomMeetingTypeModal);
document.getElementById('cancelCustomMeetingTypeBtn').addEventListener('click', closeCustomMeetingTypeModal);
            document.getElementById('closeAllMeetingsBtn').addEventListener('click', closeAllMeetingsModal);
            document.getElementById('closeTaskModalBtn').addEventListener('click', closeTaskModal);
            document.getElementById('closeNoteModalBtn').addEventListener('click', closeNoteModal);
            document.getElementById('closeTagsOverviewBtn').addEventListener('click', closeTagsOverviewModal);
            document.getElementById('closeExportModalBtn').addEventListener('click', closeExportModal);

            document.getElementById('cancelCustomerFormBtn').addEventListener('click', closeCustomerFormModal);
            document.getElementById('cancelTaskBtn').addEventListener('click', closeTaskModal);
            document.getElementById('cancelNoteBtn').addEventListener('click', closeNoteModal);
            document.getElementById('cancelConfirmBtn').addEventListener('click', closeConfirmModal);

            document.getElementById('copyCustomerInfoBtn').addEventListener('click', copyCustomerInfoToClipboard);
            document.getElementById('downloadCustomerInfoBtn').addEventListener('click', downloadCustomerInfo);
            document.getElementById('copyMeetingBtn').addEventListener('click', copyMeetingToClipboard);
            document.getElementById('downloadMeetingBtn').addEventListener('click', downloadMeeting);
            document.getElementById('copyExportModalBtn').addEventListener('click', copyFromExportModal);
            document.getElementById('downloadExportModalBtn').addEventListener('click', downloadFromExportModal);

            document.getElementById('openAddCustomerBtn').addEventListener('click', openAddCustomerForm);
            document.getElementById('addQuickTaskBtn').addEventListener('click', addQuickTask);
            document.getElementById('addParticipantBtn').addEventListener('click', addParticipant);
            document.getElementById('addSubtaskBtn').addEventListener('click', () => addSubtaskInput());

// Add this with the other modal tab setup
document.querySelectorAll('#consolidatedNotesModal .modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        document.querySelectorAll('#consolidatedNotesModal .modal-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#consolidatedNotesModal .tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`#consolidatedNotesModal [data-tab-content="${tabName}"]`).classList.add('active');
    });
});


    document.getElementById('quickTaskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addQuickTask();
        }
    });

            document.getElementById('quickTaskInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addQuickTask();
                }
            });

            document.getElementById('participantRoleInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addParticipant();
                }
            });

document.getElementById('participantEmailInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addParticipant();
    }
});

document.getElementById('participantPhoneInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addParticipant();
    }
});



document.querySelectorAll('#taskFilters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#taskFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const view = btn.dataset.view;
                    
                    if (view === 'list' || view === 'kanban') {
                        state.currentDisplayMode = view;
                        document.querySelectorAll('.view-btn[data-view="list"], .view-btn[data-view="kanban"]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        if (view === 'kanban') {
                            document.getElementById('tasksList').style.display = 'none';
                            document.getElementById('kanbanBoard').classList.add('active');
                            document.getElementById('mainContainer').classList.add('kanban-mode');
                            document.getElementById('notesContainer').classList.add('hidden');
                            document.getElementById('taskFilters').style.display = 'none';
                        } else {
                            document.getElementById('tasksList').style.display = 'flex';
                            document.getElementById('kanbanBoard').classList.remove('active');
                            document.getElementById('mainContainer').classList.remove('kanban-mode');
                            document.getElementById('notesContainer').classList.remove('hidden');
                            document.getElementById('taskFilters').style.display = 'flex';
                        }
                    } else {
                        document.querySelectorAll('.view-btn[data-view="active"], .view-btn[data-view="archived"]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        state.currentView = view;
                    }
                    
                    renderTasks();
                });
            });

            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('meetingDate').value = now.toISOString().slice(0, 16);

setTimeout(() => {
    const radios = document.querySelectorAll('input[name="followUpType"]');
    radios.forEach(radio => {
        radio.addEventListener('change', updateFollowUpPreview);
    });
}, 1000);

        }

function toggleMeetingNotesExpand(meetingId, buttonElement) {
    const content = document.getElementById(`meeting-notes-${meetingId}`);
    
    if (!content || !buttonElement) return;
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        buttonElement.textContent = 'Show More ▼';
    } else {
        content.classList.add('expanded');
        buttonElement.textContent = 'Show Less ▲';
    }
}

function toggleMeetingParticipants(meetingId, buttonElement) {
    const content = document.getElementById(`meeting-participants-${meetingId}`);
    
    if (!content || !buttonElement) return;
    
    const count = buttonElement.getAttribute('data-count') || '';
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        content.style.maxHeight = '0';
        content.style.padding = '0';
        buttonElement.textContent = `Show Participants (${count}) ▼`;
    } else {
        content.classList.add('expanded');
        content.style.maxHeight = '150px';
        content.style.overflowY = 'auto';
        content.style.padding = '0.5rem';
        buttonElement.textContent = `Hide Participants (${count}) ▲`;
    }
}

        function setupInlineTabs() {
            const tabs = document.querySelectorAll('.modal-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;
                    const formType = tab.dataset.form;
                    
                    if (formType) {
                        const formContainer = formType === 'meeting' ? '#inlineMeetingForm' : '#inlineCustomerInfoForm';
                        const formTabs = document.querySelectorAll(`${formContainer} .modal-tab`);
                        const formContents = document.querySelectorAll(`${formContainer} .tab-content`);
                        
                        formTabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        
                        formContents.forEach(content => content.classList.remove('active'));
                        const targetContent = document.querySelector(`${formContainer} [data-tab-content="${tabName}"]`);
                        if (targetContent) targetContent.classList.add('active');
                        
                        if (formType === 'meeting') {
                            state.currentMeetingTab = tabName;
                            if (tabName === 'export') {
                                updateMeetingExportPreview();
                            }
                        } else {
                            state.currentCustomerInfoTab = tabName;
                            if (tabName === 'export') {
                                updateCustomerInfoExportPreview();
                            }
                        }
                    }
                });
            });
        }

       function openInlineCustomerInfoForm(CustomerInfo = null) {
    // Hide other sections
    document.getElementById('inlineMeetingForm').classList.remove('active');
    document.getElementById('customerCustomerInfosSection').classList.remove('active');
    document.getElementById('customerMeetingsSection').classList.remove('active');
hideCustomerParticipantsSection();
hideUpcomingMeetings();
hideCustomerActivity();
    document.querySelector('.tasks-section').style.display = 'none'; // Hide tasks section
    document.getElementById('notesContainer').classList.add('hidden');
    document.getElementById('mainContainer').classList.add('form-mode');
    
    state.editingCustomerInfo = CustomerInfo;
    state.selectedCustomerInfoCustomerId = null;
    
    // Reset tabs
    document.querySelectorAll('#inlineCustomerInfoForm .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#inlineCustomerInfoForm .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('#inlineCustomerInfoForm .modal-tab[data-tab="info"]').classList.add('active');
    document.querySelector('#inlineCustomerInfoForm [data-tab-content="info"]').classList.add('active');
    state.currentCustomerInfoTab = 'info';
    
   if (CustomerInfo) {
    document.getElementById('CustomerInfoId').value = CustomerInfo.id;
    document.getElementById('CustomerInfoCustomerInput').value = CustomerInfo.customerName || '';
    state.selectedCustomerInfoCustomerId = CustomerInfo.customerId;
    document.getElementById('CustomerInfoBackground').value = CustomerInfo.background || '';
    document.getElementById('CustomerInfoDiscussionPoints').value = CustomerInfo.discussionPoints || '';
    document.getElementById('CustomerInfoMaterials').value = CustomerInfo.materials || '';
    document.getElementById('CustomerInfoOutcomes').value = CustomerInfo.outcomes || '';
} else {
        document.getElementById('CustomerInfoForm').reset();
 document.getElementById('CustomerInfoId').value = '';
        document.getElementById('CustomerInfoCustomerInput').value = '';
    }
    
    document.getElementById('inlineCustomerInfoForm').classList.add('active');
    window.scrollTo(0, 0);
}

function closeInlineCustomerInfoForm() {
    const formElement = document.getElementById('inlineCustomerInfoForm');
    if (formElement.classList.contains('active')) {
        formElement.classList.remove('active');
        document.querySelector('.tasks-section').style.display = 'block';
        document.getElementById('notesContainer').classList.remove('hidden');
        document.getElementById('mainContainer').classList.remove('form-mode');
        state.editingCustomerInfo = null;
        state.selectedCustomerInfoCustomerId = null;
        
        // Return to appropriate view
        if (state.currentCustomer === 'all') {
            showDashboard();
        } else {
            // Show customer-specific view
            showUpcomingMeetings();
            showCustomerParticipantsSection(state.currentCustomer);
            showCustomerCustomerInfosSection(state.currentCustomer);
            showCustomerMeetingsSection(state.currentCustomer);
            updateSectionTitle();
            renderTasks();
            renderTimeline();
        }
    }
}

function openInlineMeetingForm(meeting = null, isPastMeeting = true, isSharedPreview = false) {
    // Hide other sections
    document.getElementById('inlineCustomerInfoForm').classList.remove('active');
    document.getElementById('customerCustomerInfosSection').classList.remove('active');
    document.getElementById('customerMeetingsSection').classList.remove('active');
    hideCustomerParticipantsSection();
    hideUpcomingMeetings(); 
    hideCustomerActivity();
    hideAllCustomersSection();
    document.querySelector('.tasks-section').style.display = 'none';
    document.getElementById('notesContainer').classList.add('hidden');
    document.getElementById('mainContainer').classList.add('form-mode');
    
    // **CRITICAL: Set isPastMeeting flag FIRST before anything else**
    state.meetingIsPastMeeting = isPastMeeting;
    
    console.log('Opening form with isPastMeeting:', isPastMeeting); // DEBUG
    
    // Set title based on whether editing or creating new
    const titleElement = document.getElementById('meetingFormTitle');
    if (titleElement) {
        if (meeting) {
            titleElement.innerHTML = '<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> Edit Meeting';
        } else if (isPastMeeting) {
            titleElement.innerHTML = '<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> Meeting Notes';
        } else {
            titleElement.innerHTML = '<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> New Upcoming Meeting';
        }
    }
    

    
    // **CRITICAL: Force initialization FIRST**
    // EXCEPT when previewing shared meetings - preserve the shared data
    if (!isSharedPreview) {
        state.meetingTasks = [];
        state.meetingParticipants = [];
        state.editingParticipantIndex = null;
    } else {
        // For shared previews, only reset editing state
        state.editingParticipantIndex = null;
    }
    
    state.editingMeeting = meeting;
    state.selectedCustomerId = null;
    state.editingMeetingOriginalTab = state.currentMeetingTab;
    
    // Reset tabs
    document.querySelectorAll('#inlineMeetingForm .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#inlineMeetingForm .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('#inlineMeetingForm .modal-tab[data-tab="info"]').classList.add('active');
    document.querySelector('#inlineMeetingForm [data-tab-content="info"]').classList.add('active');
    state.currentMeetingTab = 'info';
    
    // Handle "Mark as completed" checkbox visibility
    const markCompletedWrapper = document.getElementById('markCompletedWrapper');
    if (markCompletedWrapper) {
        if (meeting && meeting.isPastMeeting === false) {
            markCompletedWrapper.style.display = 'flex';
            document.getElementById('meetingMarkCompleted').checked = false;
        } else {
            markCompletedWrapper.style.display = 'none';
            document.getElementById('meetingMarkCompleted').checked = false;
        }
    }
    
    if (meeting) {
        document.getElementById('meetingId').value = meeting.id;
        document.getElementById('meetingCustomerInput').value = meeting.customerName || '';
        state.selectedCustomerId = meeting.customerId;
        document.getElementById('meetingDate').value = meeting.date;
        document.getElementById('meetingType').value = meeting.type || 'other';
        document.getElementById('meetingDuration').value = meeting.duration || '';
document.getElementById('meetingConferenceLink').value = meeting.conferenceLink || '';
        document.getElementById('meetingTitle').value = meeting.title;
        document.getElementById('meetingTags').value = meeting.tags ? meeting.tags.join(', ') : '';
        
        document.getElementById('meetingMarkCompleted').checked = false;
        
        if (meeting.notesHTML) {
            setEditorHTML('meetingNotesEditor', meeting.notesHTML);
        } else {
            setEditorHTML('meetingNotesEditor', escapeHtml(meeting.notes || ''));
        }
        
        if (meeting.nextStepsHTML) {
            setEditorHTML('meetingNextStepsEditor', meeting.nextStepsHTML);
        } else {
            setEditorHTML('meetingNextStepsEditor', escapeHtml(meeting.nextSteps || ''));
        }
        
        
        state.meetingParticipants = Array.isArray(meeting.participants) ? [...meeting.participants] : [];
        
        document.getElementById('meddpiccMetrics').value = meeting.meddpicc?.metrics || '';
        document.getElementById('meddpiccEconomicBuyer').value = meeting.meddpicc?.economicBuyer || '';
        document.getElementById('meddpiccDecisionCriteria').value = meeting.meddpicc?.decisionCriteria || '';
        document.getElementById('meddpiccDecisionProcess').value = meeting.meddpicc?.decisionProcess || '';
        document.getElementById('meddpiccPaperProcess').value = meeting.meddpicc?.paperProcess || '';
        document.getElementById('meddpiccPain').value = meeting.meddpicc?.pain || '';
        document.getElementById('meddpiccChampion').value = meeting.meddpicc?.champion || '';
        document.getElementById('meddpiccCompetition').value = meeting.meddpicc?.competition || '';
    
        // Load tasks - for shared previews, use associatedTasks; otherwise search state.tasks
        if (isSharedPreview && meeting.associatedTasks && meeting.associatedTasks.length > 0) {
            // For shared previews, use the tasks from the shared data
            state.meetingTasks = meeting.associatedTasks.map(t => t.title);
        } else if (!isSharedPreview) {
            // For regular meetings, search in state.tasks
            const meetingTasks = state.tasks.filter(t => t.meetingId === meeting.id);
            state.meetingTasks = meetingTasks.map(t => t.title);
        }
        // If isSharedPreview but no associatedTasks, keep whatever was set in viewSharedMeeting
        
        if (meeting.customerId) {
            loadCustomerInfoForCustomer(meeting.customerId);
        }
    } else {
        document.getElementById('meetingForm').reset();
document.getElementById('meetingConferenceLink').value = '';
        document.getElementById('meetingId').value = '';
        
        // **CRITICAL FIX: Set date based on meeting type**
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        
        if (isPastMeeting) {
            // Past meeting - set to now
            document.getElementById('meetingDate').value = now.toISOString().slice(0, 16);
        } else {
            // Upcoming meeting - set to 2 weeks from now
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 14);
            futureDate.setMinutes(futureDate.getMinutes() - futureDate.getTimezoneOffset());
            document.getElementById('meetingDate').value = futureDate.toISOString().slice(0, 16);
        }
        
        document.getElementById('meetingCustomerInput').value = '';
        setEditorHTML('meetingNotesEditor', '');
        setEditorHTML('meetingNextStepsEditor', '');
        
        document.getElementById('CustomerInfoTab').style.display = 'none';
    }
    
    console.log('Form opened. state.meetingIsPastMeeting:', state.meetingIsPastMeeting); // DEBUG
    
    // **CRITICAL: Render lists AFTER all initialization**
    renderMeetingTasksList();
    renderParticipantsList();
    
    document.getElementById('inlineMeetingForm').classList.add('active');
    window.scrollTo(0, 0);
}


function closeInlineMeetingForm() {
    const formElement = document.getElementById('inlineMeetingForm');
    if (formElement.classList.contains('active')) {
        formElement.classList.remove('active');
        document.querySelector('.tasks-section').style.display = 'block';
        document.getElementById('notesContainer').classList.remove('hidden');
        document.getElementById('mainContainer').classList.remove('form-mode');
        state.editingMeeting = null;
        state.meetingTasks = [];
        state.meetingParticipants = [];
        state.selectedCustomerId = null;
        state.meetingIsPastMeeting = null;
        
        // Restore the original tab BEFORE clearing it
        if (state.editingMeetingOriginalTab) {
            state.currentMeetingTab = state.editingMeetingOriginalTab;
        }
        state.editingMeetingOriginalTab = null;
        editingSharedMeetingId = null;
        
        // Return to appropriate view
        if (state.currentCustomer === 'all') {
            showDashboard();
        } else {
            // Show customer-specific view
            showUpcomingMeetings();
            showCustomerParticipantsSection(state.currentCustomer);
            showCustomerCustomerInfosSection(state.currentCustomer);
            showCustomerMeetingsSection(state.currentCustomer);
            updateSectionTitle();
            renderTasks();
            renderTimeline();
        }
    }
}


function openInlineCustomerInfoFormForCustomer(customerId) {
if (isCustomerFrozen(customerId)) { showToast('Upgrade to edit this customer', 'error'); openUpgradeModal(); return; }
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Hide other sections
    document.getElementById('inlineMeetingForm').classList.remove('active');
    
    document.getElementById('customerCustomerInfosSection').classList.remove('active');
    document.getElementById('customerMeetingsSection').classList.remove('active');
    document.querySelector('.tasks-section').style.display = 'none';
    document.getElementById('notesContainer').classList.add('hidden');
    document.getElementById('mainContainer').classList.add('form-mode');
    
    state.editingCustomerInfo = null;
    state.selectedCustomerInfoCustomerId = customerId; // Set the customer ID
    
    // Reset tabs
    document.querySelectorAll('#inlineCustomerInfoForm .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#inlineCustomerInfoForm .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('#inlineCustomerInfoForm .modal-tab[data-tab="info"]').classList.add('active');
    document.querySelector('#inlineCustomerInfoForm [data-tab-content="info"]').classList.add('active');
    state.currentCustomerInfoTab = 'info';
    
    // Reset form and set customer
    document.getElementById('CustomerInfoForm').reset();
    document.getElementById('CustomerInfoCustomerInput').value = customer.name;
    
    document.getElementById('inlineCustomerInfoForm').classList.add('active');
    window.scrollTo(0, 0);
}

function openInlineMeetingFormForCustomer(customerId, isPastMeeting = true) {
if (isCustomerFrozen(customerId)) { showToast('Upgrade to add meetings to this customer', 'error'); openUpgradeModal(); return; }
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Hide other sections
    document.getElementById('inlineCustomerInfoForm').classList.remove('active');
    document.getElementById('customerCustomerInfosSection').classList.remove('active');
    document.getElementById('customerMeetingsSection').classList.remove('active');
    hideCustomerParticipantsSection(); // ADD THIS LINE
    hideUpcomingMeetings(); // ADD THIS LINE
    hideCustomerActivity(); // ADD THIS LINE
    document.querySelector('.tasks-section').style.display = 'none';
    document.getElementById('notesContainer').classList.add('hidden');
    document.getElementById('mainContainer').classList.add('form-mode');
    
    // Set title for new meeting
    const titleElement = document.getElementById('meetingFormTitle');
    if (titleElement) {
        if (isPastMeeting) {
            titleElement.innerHTML = '<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> Meeting Notes';
        } else {
            titleElement.innerHTML = '<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> New Upcoming Meeting';
        }
    }
    
    state.editingMeeting = null;
    state.meetingTasks = [];
    state.meetingParticipants = [];
    state.selectedCustomerId = customerId;
    state.editingMeetingOriginalTab = state.currentMeetingTab;
    state.meetingIsPastMeeting = isPastMeeting;
    
    // Reset tabs
    document.querySelectorAll('#inlineMeetingForm .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#inlineMeetingForm .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('#inlineMeetingForm .modal-tab[data-tab="info"]').classList.add('active');
    document.querySelector('#inlineMeetingForm [data-tab-content="info"]').classList.add('active');
    state.currentMeetingTab = 'info';
    
    // Reset form and set customer
    document.getElementById('meetingForm').reset();
document.getElementById('meetingId').value = '';
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('meetingDate').value = now.toISOString().slice(0, 16);
    document.getElementById('meetingCustomerInput').value = customer.name;
    setEditorHTML('meetingNotesEditor', '');
    setEditorHTML('meetingNextStepsEditor', '');
    renderMeetingTasksList();
    renderParticipantsList();
    
    loadCustomerInfoForCustomer(customerId);
    
    document.getElementById('inlineMeetingForm').classList.add('active');
    window.scrollTo(0, 0);
}

        function setupRichTextEditor() {
            document.querySelectorAll('.rich-text-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const command = btn.dataset.command;
                    const target = btn.dataset.target;
                    
                    let editor;
                    if (target === 'nextSteps') {
                        editor = document.getElementById('meetingNextStepsEditor');
                    } else {
                        editor = document.getElementById('meetingNotesEditor');
                    }
                    
                    editor.focus();
                    document.execCommand(command, false, null);
                    update 
ToolbarState(editor);
                });
            });

            const editors = [
                document.getElementById('meetingNotesEditor'),
                document.getElementById('meetingNextStepsEditor')
            ];

            editors.forEach(editor => {
                if (!editor) return;

                editor.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const selection = window.getSelection();
                        const range = selection.getRangeAt(0);
                        const currentNode = range.startContainer.parentNode;
                        
                        const listItem = currentNode.closest('li');
                        if (listItem) {
                            const text = listItem.textContent.trim();
                            
                            if (!text) {
                                e.preventDefault();
                                document.execCommand('outdent');
                                document.execCommand('formatBlock', false, 'p');
                            }
                        }
                    }
                });

                editor.addEventListener('mouseup', () => updateToolbarState(editor));
                editor.addEventListener('keyup', () => updateToolbarState(editor));
            });
        }

        function updateToolbarState(editor) {
            const buttons = editor.previousElementSibling?.querySelectorAll('.rich-text-btn');
            if (!buttons) return;

            buttons.forEach(btn => {
                const command = btn.dataset.command;
                let isActive = false;

                try {
                    isActive = document.queryCommandState(command);
                } catch (e) {
                    // Command not supported
                }

                if (isActive) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        function getEditorHTML(editorId) {
            const editor = document.getElementById(editorId);
            return editor.innerHTML.trim();
        }

        function setEditorHTML(editorId, html) {
            const editor = document.getElementById(editorId);
            editor.innerHTML = html || '';
        }

        function getEditorText(editorId) {
            const editor = document.getElementById(editorId);
            return editor.innerText.trim();
        }

        function htmlToPlainText(html) {
            if (!html) return '';
            
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            function processNode(node) {
                let text = '';
                let hasContent = false;
                
                for (let child of node.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        const content = child.textContent;
                        if (content) {
                            text += content;
                            hasContent = true;
                        }
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const tagName = child.tagName.toLowerCase();
                        
                        if (tagName === 'br') {
                            text += '\n';
                            hasContent = true;
                        } else if (tagName === 'div' || tagName === 'p') {
                            if (hasContent && text && !text.endsWith('\n')) {
                                text += '\n';
                            }
                            const childText = processNode(child);
                            text += childText;
                            if (childText.trim() || !childText) {
                                text += '\n';
                            }
                            hasContent = true;
                        } else if (tagName === 'ul') {
                            if (hasContent && text && !text.endsWith('\n')) {
                                text += '\n';
                            }
                            const items = child.querySelectorAll('li');
                            items.forEach(li => {
                                text += '• ' + li.textContent.trim() + '\n';
                            });
                            hasContent = true;
                        } else if (tagName === 'ol') {
                            if (hasContent && text && !text.endsWith('\n')) {
                                text += '\n';
                            }
                            const items = child.querySelectorAll('li');
                            items.forEach((li, index) => {
                                text += `${index + 1}. ` + li.textContent.trim() + '\n';
                            });
                            hasContent = true;
                        } else if (tagName !== 'li') {
                            text += processNode(child);
                            hasContent = true;
                        }
                    }
                }
                
                return text;
            }
            
            let result = processNode(temp);
            result = result.replace(/\n{3,}/g, '\n\n');
            return result.trim();
        }

        function setupMEDDPICCQuickAdd() {
            const quickButtons = document.querySelectorAll('.meddpicc-quick-btn');
            
            quickButtons.forEach(button => {
                const infoIcon = button.querySelector('.meddpicc-info-icon');
                const tooltip = button.querySelector('.meddpicc-tooltip');
                
                if (infoIcon && tooltip) {
                    infoIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                    
                    infoIcon.addEventListener('mouseenter', (e) => {
                        const rect = infoIcon.getBoundingClientRect();
                        tooltip.style.top = (rect.top - 10) + 'px';
                        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                    });
                }
                
                button.addEventListener('click', (e) => {
                    if (e.target.closest('.meddpicc-info-icon')) {
                        return;
                    }
                    
                    const field = button.dataset.field;
                    const selection = window.getSelection();
                    const selectedText = selection.toString().trim();
                    
                    if (!selectedText) {
                        showToast('Select text first', 'error');
                        return;
                    }
                    
                    const meddpiccField = document.getElementById(`meddpicc${field.charAt(0).toUpperCase() + field.slice(1)}`);
                    if (meddpiccField) {
                        const currentValue = meddpiccField.value.trim();
                        const newValue = currentValue ? currentValue + '\n\n• ' + selectedText : '• ' + selectedText;
                        meddpiccField.value = newValue;
                        button.classList.add('success-flash');
                        setTimeout(() => button.classList.remove('success-flash'), 500);
                        showToast('Added!', 'success');
                    }
                });
            });
        }

        function setupActionItemQuickAdd() {
            const quickButton = document.querySelector('.action-item-quick-btn');
            if (!quickButton) return;
            
            quickButton.addEventListener('click', () => {
                const selection = window.getSelection();
                const selectedText = selection.toString().trim();
                
                if (!selectedText) {
                    showToast('Select text first', 'error');
                    return;
                }
                
                if (!state.meetingTasks.includes(selectedText)) {
                    state.meetingTasks.push(selectedText);
                    renderMeetingTasksList();
                    quickButton.classList.add('success-flash');
                    setTimeout(() => quickButton.classList.remove('success-flash'), 500);
                    showToast('Added!', 'success');
                } else {
                    showToast('Already exists', 'error');
                }
            });
        }

function showAllTasks() {
    state.currentCustomer = 'all';
    document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
    
    // Hide all dashboard/customer sections
    hideDashboardStats();
    hideCustomerMeetingsSection();
    hideCustomerCustomerInfosSection();
    hideCustomerParticipantsSection();
    hideUpcomingMeetings();
    hideCustomerActivity();
    hideAllCustomersSection();
    
    // Hide shared meetings section
    document.getElementById('sharedMeetingsSection')?.classList.remove('active');
    
    // Hide customer header banner
    document.getElementById('customerHeaderBanner').classList.remove('active');
    
    // Close any open forms
    closeInlineMeetingForm();
    closeInlineCustomerInfoForm();
    
    // Show tasks and notes sections
    document.querySelector('.tasks-section').style.display = 'block';
    document.getElementById('notesContainer').classList.remove('hidden');
    document.getElementById('mainContainer').classList.remove('form-mode');
    
    updateSectionTitle();
    renderTasks();
    renderNotes();
}


function showDashboard(pushState = true) {
    state.currentCustomer = 'all';
    closeMobileSidebar();
    document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
    
    // Push browser history so Back button works
    if (pushState) {
        history.pushState({ view: 'dashboard' }, '', '#dashboard');
    }
    
    // Close any open forms
    closeInlineMeetingForm();
    closeInlineCustomerInfoForm();
    
    // Hide customer-specific sections
    hideCustomerMeetingsSection();
    hideCustomerCustomerInfosSection();
    hideCustomerParticipantsSection();

    // Hide shared meetings section
    document.getElementById('sharedMeetingsSection')?.classList.remove('active');
    
    // Hide statistics, show dashboard sections
    hideDashboardStats();
    showUpcomingMeetings();
    showCustomerActivity();
    showAllCustomersSection();
    
    // Show tasks and notes
    document.querySelector('.tasks-section').style.display = 'block';
    document.getElementById('notesContainer').classList.remove('hidden');
    document.getElementById('mainContainer').classList.remove('form-mode');
    
    // Hide customer header banner
    document.getElementById('customerHeaderBanner').classList.remove('active');
document.getElementById('frozenBanner').style.display = 'none';
    
    updateSectionTitle();
    renderTasks();
    renderNotes();
    renderTimeline();
}

        function showHome() {
            showDashboard();
renderNotes();
        }


function hideDashboardStats() {
    // Statistics feature removed
}


// All Customers Section Functions
let customersListFilter = 'all';

function showAllCustomersSection() {
    document.getElementById('allCustomersSection').classList.add('active');
    renderAllCustomersList();
}

function hideAllCustomersSection() {
    document.getElementById('allCustomersSection').classList.remove('active');
}

function filterCustomersList(filter) {
    customersListFilter = filter;
    document.querySelectorAll('[data-customers-filter]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-customers-filter="${filter}"]`).classList.add('active');
    renderAllCustomersList();
}

function renderAllCustomersList() {
    const container = document.getElementById('customersListContent');
    const empty = document.getElementById('allCustomersEmpty');
    const customersList = document.getElementById('allCustomersList'); // ADD THIS LINE
    const localSearch = document.getElementById('customersSearchInput').value.toLowerCase();
    const searchQuery = state.searchQuery || localSearch;
    let customers = [...state.customers];
    
    if (searchQuery) {
        customers = customers.filter(c => 
            c.name.toLowerCase().includes(searchQuery) ||
            (c.industry && c.industry.toLowerCase().includes(searchQuery)) ||
            (c.city && c.city.toLowerCase().includes(searchQuery)) ||
            (c.email && c.email.toLowerCase().includes(searchQuery)) ||
            (c.website && c.website.toLowerCase().includes(searchQuery))
        );
    }
    
    if (customersListFilter === 'pinned') {
        customers = customers.filter(c => c.pinned);
    } else if (customersListFilter === 'recent') {
        const recentCustomerIds = [...new Set(
            state.meetings.sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 20).map(m => m.customerId).filter(Boolean)
        )];
        customers = customers.filter(c => recentCustomerIds.includes(c.id));
        customers.sort((a, b) => recentCustomerIds.indexOf(a.id) - recentCustomerIds.indexOf(b.id));
    } else {
        customers.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return a.name.localeCompare(b.name);
        });
    }
    
    document.getElementById('allCustomersTotal').textContent = state.customers.length;

    if (customers.length === 0) {
        container.innerHTML = '';
        customersList.style.display = 'none'; // HIDE THE HEADER ROW
        empty.style.display = 'block';
        
        if (searchQuery) {
            empty.innerHTML = `
                <div class="empty-state-icon"><span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span></div>
                <div>No results for "${escapeHtml(searchQuery)}"</div>
            `;
        } else {
            empty.innerHTML = `
                <div class="empty-state-icon"></div>
                <div style="margin-bottom: 1rem;">No customers yet</div>
                <button class="btn-schedule-meeting" onclick="openAddCustomerForm()" style="margin: 0 auto; display: inline-flex;">
                    <span>+</span>
                    <span>Add Customer</span>
                </button>
            `;
        }
        return;
    }
    
    // SHOW THE LIST WHEN THERE ARE CUSTOMERS
    customersList.style.display = 'block';
    empty.style.display = 'none';
    
    container.innerHTML = customers.map(customer => {        const logoHtml = customer.website 
            ? `<img class="customer-logo" src="https://www.google.com/s2/favicons?domain=${customer.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}&sz=128" onerror="this.outerHTML=getBuildingSVG(20)">`
            : getBuildingSVG(20);
        
        const websiteHtml = customer.website
            ? `<a href="${customer.website.startsWith('http') ? customer.website : 'https://' + customer.website}" target="_blank" onclick="event.stopPropagation();">${customer.website.replace(/^https?:\/\//, '').replace(/^www\./, '')} <span class="icon icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span></a>`
            : '—';
        
        let addressText = '';
        if (customer.city && customer.state) addressText = `${customer.city}, ${customer.state}`;
        else if (customer.city) addressText = customer.city;
        else if (customer.address) addressText = customer.address.substring(0, 30);
        
        const addressHtml = addressText
            ? (customer.mapsLink 
                ? `<a href="${customer.mapsLink}" target="_blank" onclick="event.stopPropagation();">${escapeHtml(addressText)}</a>`
                : escapeHtml(addressText))
            : '—';
        
const frozen = isCustomerFrozen(customer.id);
return `
    <div class="customer-row 
                ${customer.pinned ? 'pinned' : ''} 
                ${frozen ? 'frozen-customer' : ''}" 
         onclick="selectCustomerFromOverview('${customer.id}')"
         title="${frozen ? '<span class="icon icon-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> Upgrade to edit this customer' : ''}">
        ${frozen ? `
            <div style="
                position: absolute;
                right: 0.5rem;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(107,114,128,0.15);
                color: var(--text-secondary);
                font-size: 0.6rem;
                font-weight: 700;
                padding: 0.15rem 0.4rem;
                border-radius: 4px;
                letter-spacing: 0.05em;
            "><span class="icon icon-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> VIEW ONLY</div>
        ` : ''}

                <div>${logoHtml}</div>
                <div class="customer-name-cell">
                    <span class="pin-star ${customer.pinned ? 'pinned' : ''}" onclick="event.stopPropagation(); togglePinCustomer('${customer.id}', event)">${customer.pinned ? '<span class="icon icon-star-filled"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>' : '<span class="icon icon-star-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>'}</span>
                    ${escapeHtml(customer.name)}
                </div>
                <div class="customer-website-cell">${websiteHtml}</div>
                <div class="customer-address-cell">${addressHtml}</div>
                <div class="customer-industry-badge">${customer.industry ? escapeHtml(customer.industry) : '—'}</div>
                <div class="customer-row-actions">
                    <button class="participant-action-btn" onclick="event.stopPropagation(); openEditCustomerForm('${customer.id}')" title="Edit">
                        <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="participant-action-btn delete" onclick="event.stopPropagation(); deleteCustomerFromSidebar('${customer.id}')" title="Delete">
                        <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function showCustomerActivity() {
    document.getElementById('customerActivitySection').classList.add('active');
    renderCustomerActivity();
}

function hideCustomerActivity() {
    document.getElementById('customerActivitySection').classList.remove('active');
}

// Upcoming Meetings Functions
function showUpcomingMeetings() {
    document.getElementById('upcomingMeetingsSection').classList.add('active');
    renderUpcomingMeetings();
}

function hideUpcomingMeetings() {
    document.getElementById('upcomingMeetingsSection').classList.remove('active');
}

function renderUpcomingMeetings() {
    const container = document.getElementById('upcomingMeetingsList');
    const empty = document.getElementById('upcomingMeetingsEmpty');
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Calculate period end date
    let periodEnd = null;
    if (state.upcomingMeetingsPeriod !== 'all') {
        periodEnd = new Date(now.getTime() + state.upcomingMeetingsPeriod * 24 * 60 * 60 * 1000);
    }
    
    // Get upcoming meetings (including recently finished ones)
    let upcomingMeetings = state.meetings.filter(m => {
        // Don't show meetings marked as past meetings
        if (m.isPastMeeting) return false;
        
        const meetingDate = new Date(m.date);
        const meetingDuration = m.duration || 60;
        const meetingEndTime = new Date(meetingDate.getTime() + meetingDuration * 60000);
        const twoHoursAfterEnd = new Date(meetingEndTime.getTime() + 2 * 60 * 60 * 1000);
        
        // Show if meeting hasn't ended + 2 hours yet
        const isUpcoming = now < twoHoursAfterEnd;
        
        if (!isUpcoming) return false;        
        // Filter by customer if viewing specific customer
        if (state.currentCustomer !== 'all' && m.customerId !== state.currentCustomer) {
            return false;
        }
        
        // Filter by period (for future meetings only)
        if (periodEnd && meetingDate > periodEnd && meetingDate > now) {
            return false;
        }
        
        return true;
    });

    // Apply global search filter
if (state.searchQuery) {
    upcomingMeetings = upcomingMeetings.filter(m => {
        const matchesTitle = m.title.toLowerCase().includes(state.searchQuery);
        const matchesCustomer = m.customerName && m.customerName.toLowerCase().includes(state.searchQuery);
        const matchesType = m.type && m.type.toLowerCase().includes(state.searchQuery);
        
        // Search in meeting notes
        const notesText = m.notesHTML ? htmlToPlainText(m.notesHTML) : (m.notes || '');
        const matchesNotes = notesText.toLowerCase().includes(state.searchQuery);
        
        // Search in next steps
        const nextStepsText = m.nextStepsHTML ? htmlToPlainText(m.nextStepsHTML) : (m.nextSteps || '');
        const matchesNextSteps = nextStepsText.toLowerCase().includes(state.searchQuery);
        
        // Search in tags
        const matchesTags = m.tags && m.tags.some(tag => tag.toLowerCase().includes(state.searchQuery));
        
        return matchesTitle || matchesCustomer || matchesType || matchesNotes || matchesNextSteps || matchesTags;
    });
}
    
    // Sort by date (earliest first)
    upcomingMeetings.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Check if there are ANY past meetings to decide on Follow-Up button
    const pastMeetings = state.meetings.filter(m => {
        if (m.isPastMeeting) return true;
        const meetingDate = new Date(m.date);
        const meetingDuration = m.duration || 60;
        const meetingEndTime = new Date(meetingDate.getTime() + meetingDuration * 60000);
        return meetingEndTime < now;
    });
    
    // Filter by customer if viewing specific customer
    const relevantPastMeetings = state.currentCustomer !== 'all' 
        ? pastMeetings.filter(m => m.customerId === state.currentCustomer)
        : pastMeetings;
    
if (upcomingMeetings.length === 0) {
    container.innerHTML = '';
    empty.removeAttribute('style');
    empty.className = 'empty-state-compact';
    empty.style.display = 'block';

    // Determine button function based on whether viewing specific customer or all
    const buttonFunction = state.currentCustomer !== 'all' 
        ? `openInlineMeetingFormForCustomer('${state.currentCustomer}', false)` 
        : `openInlineMeetingFormForUpcoming()`;
    
    const followUpFunction = state.currentCustomer !== 'all' 
        ? `openFollowUpModal('upcoming')` 
        : `openFollowUpModal('upcoming')`;
    
    empty.innerHTML = `
        <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn-schedule-meeting" onclick="${buttonFunction}" style="display: inline-flex;">
                <span>+</span>
                <span>Upcoming Meeting</span>
            </button>
            ${relevantPastMeetings.length > 0 ? `
                <button class="btn-schedule-meeting" onclick="${followUpFunction}" style="display: inline-flex;">
                    <span>+</span>
                    <span>Follow-Up</span>
                </button>
            ` : ''}
        </div>
    `;
        
        // Hide BOTH header buttons when empty
        const upcomingBtn = document.getElementById('upcomingHeaderBtn');
        if (upcomingBtn) upcomingBtn.style.display = 'none';
        
        const followUpBtn = document.getElementById('upcomingFollowUpBtn');
        if (followUpBtn) followUpBtn.style.display = 'none';
            
        return;
    }
    
    empty.style.display = 'none';
    
    container.innerHTML = upcomingMeetings.map(meeting => {
        const meetingDate = new Date(meeting.date);
        const meetingDateStr = meetingDate.toISOString().split('T')[0];
        const meetingDuration = meeting.duration || 60;
        const meetingEndTime = new Date(meetingDate.getTime() + meetingDuration * 60000);
        
        // Calculate meeting status
        const minutesUntilStart = (meetingDate - now) / (1000 * 60);
        const minutesSinceStart = (now - meetingDate) / (1000 * 60);
        const minutesSinceEnd = (now - meetingEndTime) / (1000 * 60);
        
        let meetingStatus = 'upcoming';
        let statusLabel = '';
        let statusBadge = '';
        
        if (minutesUntilStart <= 15 && minutesUntilStart > 0) {
            // Starting in 15 minutes or less
            meetingStatus = 'starting-soon';
            statusLabel = `STARTS IN ${Math.ceil(minutesUntilStart)} MIN`;
            statusBadge = `<span class="upcoming-meeting-status starting-soon"><span class="icon icon-zap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span> Starting Soon</span>`;
        } else if (minutesSinceStart >= 0 && minutesSinceStart < meetingDuration) {
            // Meeting is happening now
            meetingStatus = 'happening-now';
            statusLabel = 'HAPPENING NOW';
            statusBadge = `<span class="upcoming-meeting-status happening-now"><span class="icon icon-circle-red"><svg viewBox="0 0 24 24" fill="#ef4444" stroke="none"><circle cx="12" cy="12" r="6"/></svg></span> Live Now</span>`;
        } else if (minutesSinceEnd >= 0 && minutesSinceEnd < 120) {
            // Just finished (within 2 hours)
            meetingStatus = 'just-finished';
            statusLabel = 'JUST FINISHED';
            statusBadge = `<span class="upcoming-meeting-status just-finished"><span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Completed</span>`;
        } else {
            // Normal upcoming
            const daysUntil = Math.floor((meetingDate - now) / (1000 * 60 * 60 * 24));
            
            if (meetingDateStr === today) {
                meetingStatus = 'today';
                statusLabel = 'TODAY';
            } else if (daysUntil === 1) {
                meetingStatus = 'soon';
                statusLabel = 'TOMORROW';
            } else if (daysUntil <= 3) {
                meetingStatus = 'soon';
                statusLabel = `IN ${daysUntil} DAYS`;
            } else if (daysUntil <= 7) {
                meetingStatus = 'upcoming';
                statusLabel = `IN ${daysUntil} DAYS`;
            } else {
                meetingStatus = 'upcoming';
                statusLabel = meetingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        }
        
        // Format time
        const timeStr = meetingDate.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        // Format date for badge
        const dayName = meetingDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dateStr = meetingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Check prep status
        const hasPrep = state.CustomerInfos.some(p => p.customerId === meeting.customerId);
        
        // Check if notes exist
        const hasNotes = meeting.notes || meeting.notesHTML;
        
        // Get participant count
        const participantCount = meeting.participants ? meeting.participants.length : 0;
        
        const typeIcons = {
            discovery: '<span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>',
            'follow-up': '<span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>'
        };
        const typeIcon = typeIcons[meeting.type] || (meeting.customTypeIcon || '<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span>');
        
        // Determine button action based on status
        let primaryAction = '';
        if (meetingStatus === 'starting-soon' || meetingStatus === 'happening-now') {
            primaryAction = `
                <button class="upcoming-action-btn" onclick="event.stopPropagation(); takeMeetingNotes('${meeting.id}')" title="Take Notes" style="background: var(--primary); color: white;">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </button>
            `;
        } else if (meetingStatus === 'just-finished') {
            if (hasNotes) {
                primaryAction = `
                    <button class="upcoming-action-btn" onclick="event.stopPropagation(); viewMeetingNotes('${meeting.id}')" title="View Notes" style="background: var(--success); color: white;">
                        <svg viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                `;
            } else {
                primaryAction = `
                    <button class="upcoming-action-btn" onclick="event.stopPropagation(); takeMeetingNotes('${meeting.id}')" title="Add Notes" style="background: var(--warning); color: white;">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </button>
                `;
            }
        } else if (!hasPrep) {
            primaryAction = `
                <button class="upcoming-action-btn" onclick="event.stopPropagation(); createPrepForUpcoming('${meeting.customerId}')" title="Create Prep" style="background: var(--warning); color: white;">
                    <svg viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                </button>
            `;
        }
        
        return `
            <div class="upcoming-meeting-row ${meetingStatus}" onclick="editUpcomingMeeting('${meeting.id}')" data-meeting-id="${meeting.id}">
                <div class="upcoming-meeting-date ${meetingStatus}">
                    <div class="upcoming-date-day">${statusLabel.includes('MIN') || statusLabel === 'HAPPENING NOW' || statusLabel === 'JUST FINISHED' || statusLabel === 'TODAY' || statusLabel === 'TOMORROW' ? statusLabel.split(' ')[0] : dayName}</div>
                    <div class="upcoming-date-date">${statusLabel.includes('MIN') || statusLabel === 'HAPPENING NOW' || statusLabel === 'JUST FINISHED' ? timeStr.split(' ')[0] : (statusLabel === 'TODAY' || statusLabel === 'TOMORROW' ? timeStr.split(' ')[0] : dateStr)}</div>
                </div>
                
                <div class="upcoming-meeting-details">
                    <div class="upcoming-meeting-time-title">
                        <span class="upcoming-meeting-time">${timeStr}</span>
                        <span class="upcoming-meeting-title">${escapeHtml(meeting.title)} • ${escapeHtml(meeting.customerName || 'Unknown')}</span>
                        ${statusBadge}
                    </div>
                    <div class="upcoming-meeting-meta">
                        ${participantCount > 0 ? `<span class="upcoming-meeting-meta-item"><span class="icon icon-users"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span> ${participantCount}</span>` : ''}
${meeting.conferenceLink ? `<a href="${escapeHtml(meeting.conferenceLink)}" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="upcoming-meeting-meta-item" style="color: var(--primary); text-decoration: none;"><span class="icon icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span> Join</a>` : ''}
                        ${meeting.type ? `<span class="upcoming-meeting-meta-item">${typeIcon} ${meeting.type.replace('-', ' ')}</span>` : ''}
                        ${meeting.duration ? `<span class="upcoming-meeting-meta-item"><span class="icon icon-clock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span> ${meeting.duration}min</span>` : ''}
                        ${meetingStatus === 'just-finished' ? 
                            (hasNotes ? 
                                `<span class="upcoming-prep-status ready"><span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Notes added</span>` : 
                                `<span class="upcoming-prep-status none"><span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> No notes yet</span>`
                            ) :
                            `<span class="upcoming-prep-status ${hasPrep ? 'ready' : 'none'}">${hasPrep ? '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer info' : '<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> No customer info'}</span>`
                        }
                    </div>
                </div>
                
                <div class="upcoming-meeting-actions">
                    ${primaryAction}
                    <button class="upcoming-action-btn" onclick="event.stopPropagation(); editUpcomingMeeting('${meeting.id}')" title="Edit">
                        <svg viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="upcoming-action-btn delete" onclick="event.stopPropagation(); deleteUpcomingMeeting('${meeting.id}')" title="Delete">
                        <svg viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Show the + Upcoming Meeting button in header when there are meetings
    const upcomingBtn = document.getElementById('upcomingHeaderBtn');
    if (upcomingBtn) {
        upcomingBtn.style.display = 'flex';
    }
    
    // Show the + Follow-Up button in header ONLY when there are meetings AND past meetings exist
    const followUpBtn = document.getElementById('upcomingFollowUpBtn');
    if (followUpBtn) {
        followUpBtn.style.display = relevantPastMeetings.length > 0 ? 'flex' : 'none';
    }
}

function editUpcomingMeeting(meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (meeting) {
        // Pass meeting's isPastMeeting flag (false for upcoming = notes not required)
        openInlineMeetingForm(meeting, meeting.isPastMeeting === true);
    }
}

function deleteUpcomingMeeting(meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete Meeting?', `Delete "${meeting.title}"?`, () => {
        state.meetings = state.meetings.filter(m => m.id !== meetingId);
        
        // Remove meeting reference from tasks
        state.tasks.forEach(task => {
            if (task.meetingId === meetingId) {
                delete task.meetingId;
            }
        });
        
        saveData();
        renderUpcomingMeetings();
        updateStats();
        
        if (state.currentCustomer !== 'all') {
            showCustomerMeetingsSection(state.currentCustomer);
        }
        
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Meeting deleted', 'success');
    });
}

function createPrepForUpcoming(customerId) {
    if (customerId) {
        openInlineCustomerInfoFormForCustomer(customerId);
    } else {
        openInlineCustomerInfoForm();
    }
}


function takeMeetingNotes(meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    // Store that we're taking notes for this specific meeting
    sessionStorage.setItem('[REDACTED:AWS_ACCESS_KEY]g', meetingId);
    
    openInlineMeetingForm(meeting);
    
    // Auto-switch to Notes tab
    setTimeout(() => {
        const notesTab = document.querySelector('#inlineMeetingForm .modal-tab[data-tab="notes"]');
        if (notesTab) {
            notesTab.click();
        }
        
        // Focus the notes editor
        const notesEditor = document.getElementById('meetingNotesEditor');
        if (notesEditor) {
            notesEditor.focus();
        }
    }, 200);
}

function viewMeetingNotes(meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    openInlineMeetingForm(meeting);
    
    // Auto-switch to Notes tab
    setTimeout(() => {
        const notesTab = document.querySelector('#inlineMeetingForm .modal-tab[data-tab="notes"]');
        if (notesTab) {
            notesTab.click();
        }
    }, 200);
}

function scrollToMeetingInHistory(meetingId, customerId) {
    // If not viewing this customer, switch to them first
    if (state.currentCustomer !== customerId) {
        selectCustomerFromOverview(customerId);
        
        // Wait for render then scroll
        setTimeout(() => scrollAndHighlightMeeting(meetingId), 500);
    } else {
        scrollAndHighlightMeeting(meetingId);
    }
}

function scrollAndHighlightMeeting(meetingId) {
    // Make sure meetings section is visible and expanded
    const meetingsSection = document.getElementById('customerMeetingsSection');
    if (meetingsSection) {
        meetingsSection.classList.remove('collapsed');
        meetingsSection.classList.add('active');
        
        // Find the meeting card
        setTimeout(() => {
            const meetingCard = document.querySelector(`[data-meeting-id="${meetingId}"]`);
            if (meetingCard) {
                // Scroll to it
                meetingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Add highlight animation
                meetingCard.classList.add('meeting-highlight-flash');
                
                // Remove animation class after it completes
                setTimeout(() => {
                    meetingCard.classList.remove('meeting-highlight-flash');
                }, 3000);
            }
        }, 200);
    }
}

function openInlineMeetingFormForUpcoming() {
    // Hide upcoming meetings and participants sections
    hideUpcomingMeetings();
    hideCustomerParticipantsSection();
    
    // If viewing a specific customer, auto-fill with that customer
    if (state.currentCustomer !== 'all') {
        openInlineMeetingFormForCustomer(state.currentCustomer, false); // false = upcoming meeting
    } else {
        openInlineMeetingForm(null, false); // false = upcoming meeting
    }
}

function filterCustomerActivity(filter) {
    state.activityFilter = filter;
    
    // Update active button
    document.querySelectorAll('[data-activity-filter]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-activity-filter="${filter}"]`).classList.add('active');
    
    // Hide custom date range if not custom
    if (filter !== 'custom') {
        document.getElementById('customDateRangeInputs').style.display = 'none';
    }
    
    renderCustomerActivity();
}

function updateActivityDateDisplay(type) {
    const picker = document.getElementById(`activity${type === 'start' ? 'Start' : 'End'}DatePicker`);
    const display = document.getElementById(`activity${type === 'start' ? 'Start' : 'End'}DateDisplay`);
    
    if (picker.value) {
        // Convert YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = picker.value.split('-');
        display.value = `${day}/${month}/${year}`;
    }
}


function showCustomDateRange() {
    state.activityFilter = 'custom';
    
    // Update active button
    document.querySelectorAll('[data-activity-filter]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-activity-filter="custom"]').classList.add('active');
    
    // Show date inputs
    document.getElementById('customDateRangeInputs').style.display = 'block';
    
    // Set default dates if not set
    if (!state.activityCustomRange.start) {
        const today = new Date();
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const formatDateYYYYMMDD = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        const formatDateDDMMYYYY = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };
        
        // Set picker values (YYYY-MM-DD)
        document.getElementById('activityStartDatePicker').value = formatDateYYYYMMDD(lastMonth);
        document.getElementById('activityEndDatePicker').value = formatDateYYYYMMDD(today);
        
        // Set display values (DD/MM/YYYY)
        document.getElementById('activityStartDateDisplay').value = formatDateDDMMYYYY(lastMonth);
        document.getElementById('activityEndDateDisplay').value = formatDateDDMMYYYY(today);
    }
}

function applyCustomDateRange() {
    const startDate = document.getElementById('activityStartDatePicker').value;
    const endDate = document.getElementById('activityEndDatePicker').value;
    
    if (!startDate || !endDate) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Select both dates', 'error');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Start date must be before end date', 'error');
        return;
    }
    
    state.activityCustomRange.start = startDate;
    state.activityCustomRange.end = endDate;
    
    renderCustomerActivity();
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Custom range applied', 'success');
}

function renderCustomerActivity() {
    const container = document.getElementById('customerActivityGrid');
    const empty = document.getElementById('customerActivityEmpty');
    
    const now = new Date();
    
    // Apply date filter
    let filterStartDate = null;
    let filterEndDate = null;
    
    if (state.activityFilter === 'week') {
        filterStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filterEndDate = now;
    } else if (state.activityFilter === 'month') {
        filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        filterEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (state.activityFilter === 'custom') {
        if (state.activityCustomRange.start) {
            filterStartDate = new Date(state.activityCustomRange.start);
        }
        if (state.activityCustomRange.end) {
            filterEndDate = new Date(state.activityCustomRange.end);
            filterEndDate.setHours(23, 59, 59, 999);
        }
    }
    
    // Get ALL meetings with their customers
    const allMeetingsWithCustomers = [];
    
    state.customers.forEach(customer => {
    const meetings = state.meetings.filter(m => {
        if (m.customerId !== customer.id) return false;
        const meetingDate = new Date(m.date);

        // Filter by date range if applicable
        if (filterStartDate && meetingDate < filterStartDate) return false;
        if (filterEndDate && meetingDate > filterEndDate) return false;

        // Show calls always (they are always past by definition)
        if (m.type === 'phone-call') return true;

        // Show if meeting is in the past OR if it's been marked as completed
        return meetingDate < now || m.markedCompleted;
    });

        
        meetings.forEach(meeting => {
            const meetingDate = new Date(meeting.date);
            const daysSince = Math.floor((now - meetingDate) / (1000 * 60 * 60 * 24));
            
            allMeetingsWithCustomers.push({
                customer,
                meeting,
                meetingDate,
                daysSince
            });
        });
    });
    
    // **NEW: Apply global search filter**
    // Apply both global search and local activity search
const localActivitySearch = (document.getElementById('activitySearchInput')?.value || '').toLowerCase().trim();
const activityQuery = localActivitySearch || state.searchQuery || '';

let filteredMeetings = allMeetingsWithCustomers;
if (activityQuery) {
    filteredMeetings = allMeetingsWithCustomers.filter(data => {
        const matchesCustomer = data.customer.name.toLowerCase().includes(activityQuery);
        const matchesMeeting = data.meeting.title && data.meeting.title.toLowerCase().includes(activityQuery);
        const matchesIndustry = data.customer.industry && data.customer.industry.toLowerCase().includes(activityQuery);
        const matchesTags = data.meeting.tags && data.meeting.tags.some(tag => tag.toLowerCase().includes(activityQuery));
        const matchesActivityNote = data.meeting.activityNote && data.meeting.activityNote.toLowerCase().includes(activityQuery);

        // Search in meeting notes
        const notesText = data.meeting.notesHTML ? htmlToPlainText(data.meeting.notesHTML) : (data.meeting.notes || '');
        const matchesNotes = notesText.toLowerCase().includes(activityQuery);

        // Search in next steps
        const nextStepsText = data.meeting.nextStepsHTML ? htmlToPlainText(data.meeting.nextStepsHTML) : (data.meeting.nextSteps || '');
        const matchesNextSteps = nextStepsText.toLowerCase().includes(activityQuery);

        // Search in participants (useful for calls)
        const matchesParticipants = data.meeting.participants && data.meeting.participants.some(p =>
            p.name && p.name.toLowerCase().includes(activityQuery)
        );

        return matchesCustomer || matchesMeeting || matchesIndustry || matchesTags ||
               matchesActivityNote || matchesNotes || matchesNextSteps || matchesParticipants;
    });
}


    // Sort by most recent first
    filteredMeetings.sort((a, b) => b.meetingDate - a.meetingDate);
    
    if (filteredMeetings.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        
        // Show different message if search is active
        if (state.searchQuery) {
            empty.innerHTML = `
                <div class="empty-state-icon"><span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span></div>
                <div>No results for "${escapeHtml(state.searchQuery)}"</div>
            `;
        } else {
    empty.innerHTML = `
        <div class="empty-state-icon"></div>
        <div style="margin-bottom: 1rem;">No customer meetings yet</div>
        <button class="btn-schedule-meeting" onclick="openInlineMeetingForm()" style="margin: 0 auto; display: inline-flex;">
            <span>+</span>
            <span>Meeting</span>
        </button>
    `;
}
        return;
    }
    
    empty.style.display = 'none';
    
// Update section title with count
const sectionTitle = document.querySelector('#customerActivitySection .section-title');
if (sectionTitle) {
    sectionTitle.textContent = `Customer Activity (${filteredMeetings.length})`;
}
    
    // Build header + rows
    let html = `
        <div class="activity-header-row">
            <div class="activity-header-cell"></div>
            <div class="activity-header-cell">Customer</div>
            <div class="activity-header-cell">Meeting</div>
            <div class="activity-header-cell">Note</div>
            <div class="activity-header-cell right">Date</div>
            <div class="activity-header-cell"></div>
        </div>
    `;
    
    html += filteredMeetings.map(data => {
        let statusClass = 'recent';
        let daysText = '';
        
        const meetingDate = data.meetingDate.toLocaleDateString('en-GB', { 
            day: 'numeric',
            month: 'short', 
            year: 'numeric' 
        });
        
        if (data.daysSince === 0) {
            daysText = `Today (${meetingDate})`;
        } else if (data.daysSince === 1) {
            daysText = `1 day ago (${meetingDate})`;
        } else if (data.daysSince < 0) {
            const daysUntil = Math.abs(data.daysSince);
            daysText = daysUntil === 1 ? `Tomorrow (${meetingDate})` : `In ${daysUntil} days (${meetingDate})`;
        } else {
            daysText = `${data.daysSince} days ago (${meetingDate})`;
        }
        
        if (data.daysSince > getActivityThresholds().overdueDays) {
            statusClass = 'overdue';
        } else if (data.daysSince > getActivityThresholds().warningDays) {
            statusClass = 'warning';
        }
        
        const noteText = data.meeting.activityNote || '';
        // Build display values for calls vs meetings
const isPhoneCall = data.meeting.type === 'phone-call';
const thresholds = getActivityThresholds();
const colorEnabled = isPhoneCall ? (thresholds.colorCalls === true) : (thresholds.colorMeetings === true);
const activityRowClass = isPhoneCall
    ? (data.meeting.connected ? 'phone-call-connected' : 'phone-call-missed')
    : statusClass;
const dotClass = colorEnabled ? statusClass : 'hidden';

const activityTitle = isPhoneCall
    ? `Call${data.meeting.participants && data.meeting.participants.length > 0
        ? ' · ' + data.meeting.participants.map(p => p.name).join(', ')
        : ''}`
    : data.meeting.title;

const activitySubline = isPhoneCall
    ? (data.meeting.connected
        ? `${data.meeting.duration ? data.meeting.duration + ' min' : 'Connected'}`
        : (data.meeting.reason || 'No Answer'))
    : '';

return `
    <div class="activity-row ${activityRowClass}" onclick="scrollToMeetingInHistory('${data.meeting.id}', '${data.customer.id}')">
        <div class="activity-status-dot ${dotClass}"></div>
        <div class="activity-customer">${escapeHtml(data.customer.name)}</div>
        <div class="activity-meeting">
            ${escapeHtml(activityTitle)}
            ${activitySubline ? `<br><span style="font-size:0.75rem; color:var(--text-secondary);">${escapeHtml(activitySubline)}</span>` : ''}
        </div>

                <div class="activity-note-cell" onclick="event.stopPropagation()">
                    ${noteText ? `<span class="activity-note-text" onclick="editActivityNote('${data.meeting.id}')" title="${escapeHtml(noteText)}">${escapeHtml(noteText)}</span>` : `<textarea rows="1" class="activity-note-input" id="note-${data.meeting.id}" placeholder="+ note" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" onkeypress="if(event.key==='Enter')saveActivityNote('${data.meeting.id}')" onblur="saveActivityNote('${data.meeting.id}')"></textarea>`}
                </div>
                <div class="activity-time ${colorEnabled ? statusClass : ''}">${daysText}</div>
                <div class="activity-arrow">→</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}


function saveActivityNote(meetingId) {
    const input = document.getElementById(`note-${meetingId}`);
    if (!input) return;
    const note = input.value.trim();
    if (!note) { editActivityNote(meetingId); return; }
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (meeting) {
        meeting.activityNote = note;
        saveData();
        renderCustomerActivity();
        showToast('<span class="icon icon-edit-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span> Note saved', 'success');
    }
}

function editActivityNote(meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    document.getElementById('noteEditMeetingId').value = meetingId;
    document.getElementById('noteEditText').value = meeting.activityNote || '';
    document.getElementById('noteEditModal').classList.add('active');
    document.getElementById('noteEditText').focus();
}

function closeNoteEditModal() {
    document.getElementById('noteEditModal').classList.remove('active');
}

function saveEditedNote() {
    const meetingId = document.getElementById('noteEditMeetingId').value;
    const note = document.getElementById('noteEditText').value.trim();
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (meeting) {
        meeting.activityNote = note;
        saveData();
        renderCustomerActivity();
        showToast('<span class="icon icon-edit-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span> Note updated', 'success');
    }
    closeNoteEditModal();
}

function toggleSectionFullscreen(sectionId, btnId) {
    const section = document.getElementById(sectionId);
    const btn = document.getElementById(btnId);
    section.classList.toggle('fullscreen');
    btn.innerHTML = section.classList.contains('fullscreen') ? '<span class="icon icon-x"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span> Close' : '<span class="icon icon-maximize"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg></span> Expand';
}




function selectCustomerFromOverview(customerId, pushState = true) {
    closeMobileSidebar();
    // Validate customer exists
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Customer not found', 'error');
        return;
    }
    
    // Push browser history so Back button works
    if (pushState) {
        history.pushState({ view: 'customer', customerId: customerId }, '', '#customer-' + customerId);
    }
    
    state.currentCustomer = customerId;
    state.currentMeetingTab = 'all'; 
    
    // Update sidebar active state
    document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
    const customerFilter = document.querySelector(`.category-filter[data-customer="${customerId}"]`);
    if (customerFilter) customerFilter.classList.add('active');
    
    // Close any open forms
    closeInlineMeetingForm();
    closeInlineCustomerInfoForm();
    
    // Hide dashboard sections
    hideDashboardStats();
    hideCustomerActivity();
hideAllCustomersSection();
    document.getElementById('sharedMeetingsSection')?.classList.remove('active');
    
    // Show customer-specific sections
    showUpcomingMeetings();  
    showCustomerParticipantsSection(customerId);
    showCustomerCustomerInfosSection(customerId);
    showCustomerMeetingsSection(customerId);
    
    // Update header banner
    updateSectionTitle();
    updateCustomerBanner(customerId);
    
    // Ensure main content areas are visible
    document.querySelector('.tasks-section').style.display = 'block';
    document.getElementById('notesContainer').classList.remove('hidden');
    document.getElementById('mainContainer').classList.remove('form-mode');
    
    // Render content
    renderTasks();
    renderNotes();
    renderTimeline();
updateFrozenBanner();
}

function showCustomerParticipantsSection(customerId) {
    const section = document.getElementById('customerParticipantsSection');
    const grid = document.getElementById('customerParticipantsGrid');
    const empty = document.getElementById('customerParticipantsEmpty');
    
    // Update section title with count - clear old badge first
    const sectionTitle = section.querySelector('.customer-section-title');
    if (sectionTitle) {
        const oldBadge = sectionTitle.querySelector('.section-count-badge');
        if (oldBadge) oldBadge.remove();
    }
    
    // Get customer
    const customer = state.customers.find(c => c.id === customerId);
    
    // Get all meetings for this customer
    const customerMeetings = state.meetings.filter(m => m.customerId === customerId);
    
    // Collect all unique participants
    const participantsMap = new Map();
    
    // Add standalone contacts from customer
    if (customer && customer.participants) {
        customer.participants.forEach(participant => {
            const key = participant.email && participant.email.trim() 
                ? participant.email.toLowerCase().trim() 
                : participant.name.toLowerCase().trim();
            
            participantsMap.set(key, {
                ...participant,
                meetings: [],
                uniqueKey: key,
                isStandalone: true
            });
        });
    }
    
    // Add participants from meetings
    customerMeetings.forEach(meeting => {
        if (meeting.participants && meeting.participants.length > 0) {
            meeting.participants.forEach(participant => {
                // Create consistent key
                const key = participant.email && participant.email.trim() 
                    ? participant.email.toLowerCase().trim() 
                    : participant.name.toLowerCase().trim();
                
                if (!participantsMap.has(key)) {
                    participantsMap.set(key, {
                        ...participant,
                        meetings: [],
                        uniqueKey: key
                    });
                } else {
                    // Mark as no longer standalone if they're in a meeting
                    participantsMap.get(key).isStandalone = false;
                }
                
                participantsMap.get(key).meetings.push({
                    title: meeting.title,
                    date: meeting.date,
                    id: meeting.id
                });
            });
        }
    });
    
    const participants = Array.from(participantsMap.values());
    
if (participants.length === 0) {
    section.classList.add('empty');
    grid.innerHTML = '';
    empty.removeAttribute('style');  
    empty.className = 'empty-state-compact';
    empty.innerHTML = `
        <div style="display: flex; gap: 0.5rem; justify-content: center;">
            <button class="btn-schedule-meeting" onclick="openAddParticipantModal('${customerId}')" style="display: inline-flex;">
                <span>+</span>
                <span>Contact</span>
            </button>
        </div>
    `;
        
        // Remove the button from header when empty
        const sectionHeader = section.querySelector('.customer-section-header');
        if (sectionHeader) {
            const existingBtn = sectionHeader.querySelector('.btn-add-participant');
            const existingWrapper = sectionHeader.querySelector('.section-header-right');
            if (existingBtn) existingBtn.remove();
            if (existingWrapper) existingWrapper.remove();
            
            // Keep just the toggle
            let toggle = sectionHeader.querySelector('.customer-section-toggle');
            if (!toggle) {
                toggle = document.createElement('div');
                toggle.className = 'customer-section-toggle';
                toggle.textContent = '▼';
                sectionHeader.appendChild(toggle);
            }
        }
   } else {
    section.classList.remove('empty');
    empty.style.display = 'none'; 
  // Build header + rows
let html = `
    <div class="participant-header-row">
        <div class="participant-header-cell">Name</div>
        <div class="participant-header-cell">Title</div>
        <div class="participant-header-cell">Email</div>
        <div class="participant-header-cell">Phone</div>
        <div class="participant-header-cell"></div>
    </div>
`;

html += participants.map(participant => {
    const participantKey = participant.uniqueKey;
    
    return `
        <div class="participant-overview-card" onclick="editParticipantFromOverview('${escapeHtml(participantKey)}', '${customerId}')">
            <div class="participant-overview-name-single">${escapeHtml(participant.name)}</div>
            <div class="participant-overview-role-single">${participant.role ? escapeHtml(participant.role) : '-'}</div>
            <div class="participant-overview-email-single">${participant.email ? escapeHtml(participant.email) : '-'}</div>
            <div class="participant-overview-phone-single">${participant.phone ? escapeHtml(participant.phone) : '-'}</div>
            <div class="participant-overview-actions-single">
                <button class="participant-action-btn" onclick="event.stopPropagation(); editParticipantFromOverview('${escapeHtml(participantKey)}', '${customerId}')" title="Edit">
                    <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2;">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="participant-action-btn delete" onclick="event.stopPropagation(); deleteParticipantFromOverview('${escapeHtml(participantKey)}', '${customerId}')" title="Delete">
                    <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2;">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}).join('');

grid.innerHTML = html;
        
    // Add buttons to section header - ONLY when there are participants
const sectionHeader = section.querySelector('.customer-section-header');
if (sectionHeader) {
    // Find and preserve the existing toggle BEFORE removing anything
    let toggle = sectionHeader.querySelector('.customer-section-toggle');
    
    // Remove ALL existing buttons and wrapper completely
    const existingWrapper = sectionHeader.querySelector('.section-header-right');
    if (existingWrapper) {
        existingWrapper.remove();
    }
    // Also remove any stray buttons that might exist
    const strayBtns = sectionHeader.querySelectorAll('.btn-add-meeting, .btn-add-participant');
    strayBtns.forEach(btn => btn.remove());
    
    // If toggle was removed with wrapper, recreate it
    toggle = sectionHeader.querySelector('.customer-section-toggle');
    if (!toggle) {
        toggle = document.createElement('div');
        toggle.className = 'customer-section-toggle';
        toggle.textContent = '▼';
    }
    
    // ONLY add button if there are participants (not in empty state)
    if (participants.length > 0) {
        // Create wrapper for button and toggle
        const rightWrapper = document.createElement('div');
        rightWrapper.className = 'section-header-right';
        rightWrapper.style.display = 'flex';
        rightWrapper.style.alignItems = 'center';
        rightWrapper.style.gap = '0.5rem';
        
        // Create add contact button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-participant';
        addBtn.innerHTML = '+ Contact';
        addBtn.onclick = (e) => {
            e.stopPropagation();
            openAddParticipantModal(customerId);
        };
        
        rightWrapper.appendChild(addBtn);
        rightWrapper.appendChild(toggle);
        sectionHeader.appendChild(rightWrapper);
    } else {
        // No participants - just add toggle back
        if (!sectionHeader.querySelector('.customer-section-toggle')) {
            sectionHeader.appendChild(toggle);
        }
    }
}

        
        // Add count badge to title
        const sectionTitleFinal = section.querySelector('.customer-section-title');
        if (sectionTitleFinal) {
            const badge = document.createElement('span');
            badge.className = 'section-count-badge';
            badge.textContent = `(${participants.length})`;
            sectionTitleFinal.appendChild(badge);
        }
    }

    section.classList.add('active');
}

function hideCustomerParticipantsSection() {
    document.getElementById('customerParticipantsSection').classList.remove('active');
}

function updateSectionTitle() {
    const titleElement = document.getElementById('mainSectionTitle');
    const headerBanner = document.getElementById('customerHeaderBanner');
    
    if (state.currentCustomer !== 'all') {
        const customer = state.customers.find(c => c.id === state.currentCustomer);
        if (customer) {
            titleElement.textContent = 'Tasks';
            headerBanner.classList.add('active');
            updateCustomerBanner(state.currentCustomer);
        }
    } else {
        titleElement.textContent = 'Tasks';
        headerBanner.classList.remove('active');
    }
}

       function showCustomerCustomerInfosSection(customerId) {
    const section = document.getElementById('customerCustomerInfosSection');
    const container = document.getElementById('customerCustomerInfosList');
    const empty = document.getElementById('customerCustomerInfosEmpty');
    
    // Update section title with count - clear old badge first
    const sectionTitle = section.querySelector('.customer-section-title');
    if (sectionTitle) {
        const oldBadge = sectionTitle.querySelector('.section-count-badge');
        if (oldBadge) oldBadge.remove();
    }
    
    const customerCustomerInfos = state.CustomerInfos.filter(p => p.customerId === customerId);
    
if (customerCustomerInfos.length === 0) {
    section.classList.add('empty');
    container.innerHTML = '';
    empty.className = 'empty-state-compact';
    empty.removeAttribute('style');  
    empty.innerHTML = `
        <div style="display: flex; gap: 0.5rem; justify-content: center;">
            <button class="btn-schedule-meeting" onclick="openInlineCustomerInfoFormForCustomer('${customerId}')" style="display: inline-flex;">
                <span>+</span>
                <span>Info</span>
            </button>
        </div>
    `;
    } else {
    section.classList.remove('empty');
    empty.style.display = 'none';  
        container.innerHTML = customerCustomerInfos.map(prep => {
    // Build HTML content with styled labels
    let allContentHTML = '';
    
    if (prep.background) {
        allContentHTML += `<div style="font-weight: 700; color: #000000; margin-bottom: 0.5rem; margin-top: 0.5rem;"><span class="icon icon-book-open"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span> BACKGROUND</div>`;
        allContentHTML += `<div style="margin-bottom: 1rem;">${escapeHtml(prep.background).replace(/\n/g, '<br>')}</div>`;
    }
    if (prep.discussionPoints) {
        allContentHTML += `<div style="font-weight: 700; color: #000000; margin-bottom: 0.5rem; margin-top: 0.5rem;"><span class="icon icon-message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span> DISCUSSION POINTS</div>`;
        allContentHTML += `<div style="margin-bottom: 1rem;">${escapeHtml(prep.discussionPoints).replace(/\n/g, '<br>')}</div>`;
    }
    if (prep.materials) {
        allContentHTML += `<div style="font-weight: 700; color: #000000; margin-bottom: 0.5rem; margin-top: 0.5rem;"><span class="icon icon-package"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></span> COMPETITIVE INTELLIGENCE</div>`;
        allContentHTML += `<div style="margin-bottom: 1rem;">${escapeHtml(prep.materials).replace(/\n/g, '<br>')}</div>`;
    }
    if (prep.outcomes) {
        allContentHTML += `<div style="font-weight: 700; color: #000000; margin-bottom: 0.5rem; margin-top: 0.5rem;"><span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> EXPECTED OUTCOMES</div>`;
        allContentHTML += `<div style="margin-bottom: 1rem;">${escapeHtml(prep.outcomes).replace(/\n/g, '<br>')}</div>`;
    }
    
    // Count how many fields are populated (each adds a header + content block)
let populatedFieldCount = 0;
if (prep.background && prep.background.trim()) populatedFieldCount++;
if (prep.discussionPoints && prep.discussionPoints.trim()) populatedFieldCount++;
if (prep.materials && prep.materials.trim()) populatedFieldCount++;
if (prep.outcomes && prep.outcomes.trim()) populatedFieldCount++;

const plainTextLength = (prep.background || '').length + 
                        (prep.discussionPoints || '').length + 
                        (prep.materials || '').length + 
                        (prep.outcomes || '').length;

// Show "Show More" if:
// - More than 2 fields are populated (each field adds header + content visually)
// - OR total text length > 150 chars
const isLong = populatedFieldCount > 2 || plainTextLength > 150;
    
    return `
        <div class="customer-CustomerInfo-summary">
            <div class="meeting-summary-header">
                <div style="flex: 1;">
                    <div style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600;">Customer Info</div>
                    <div class="meeting-summary-title"><span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> ${new Date(prep.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="task-actions">
                    <button class="task-btn" onclick="editCustomerInfoFromCustomer('${prep.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="task-btn" onclick="exportCustomerInfoFromList('${prep.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                    <button class="task-btn delete" onclick="deleteCustomerInfo('${prep.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="meeting-summary-notes">
                <div class="meeting-summary-notes-content" id="prep-all-${prep.id}">${allContentHTML}</div>
                ${isLong ? `
                    <button class="meeting-summary-notes-toggle" onclick="event.stopPropagation(); toggleCustomerInfoExpand('prep-all-${prep.id}', this)">
                        Show More ▼
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}).join('');
    }
    
    section.classList.add('active');
    
        // Add count badge to title
    const sectionTitleFinal = section.querySelector('.customer-section-title');
    if (sectionTitleFinal && customerCustomerInfos.length > 0) {
        const badge = document.createElement('span');
        badge.className = 'section-count-badge';
        badge.textContent = `(${customerCustomerInfos.length})`;
        sectionTitleFinal.appendChild(badge);
    }
}

        function hideCustomerCustomerInfosSection() {
            document.getElementById('customerCustomerInfosSection').classList.remove('active');
        }

        function toggleCustomerInfoExpand(elementId, buttonElement) {
    const content = document.getElementById(elementId);
    
    if (!content || !buttonElement) return;
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        buttonElement.textContent = 'Show More ▼';
    } else {
        content.classList.add('expanded');
        buttonElement.textContent = 'Show Less ▲';
    }
}

        function editCustomerInfoFromCustomer(CustomerInfoId) {
            const CustomerInfo = state.CustomerInfos.find(p => p.id === CustomerInfoId);
            if (CustomerInfo) openInlineCustomerInfoForm(CustomerInfo);
        }

      function showCustomerMeetingsSection(customerId) {
    const section = document.getElementById('customerMeetingsSection');
    const container = document.getElementById('customerMeetingsList');
    const empty = document.getElementById('customerMeetingsEmpty');

    // Hide shared meetings section in customer view
    document.getElementById('sharedMeetingsSection')?.classList.remove('active');
    
    // Initialize default tabs if needed
    if (!state.meetingTabs || state.meetingTabs.length === 0) {
        state.meetingTabs = [
            { id: 'all', name: 'All Meetings', icon: '', isDefault: true },
            { id: 'individual', name: 'Individual', icon: '', isDefault: true }
        ];
    }
    
    // Get all meetings for this customer - ONLY PAST OR COMPLETED MEETINGS
const now = new Date();
let customerMeetings = state.meetings.filter(m => {
    if (m.customerId !== customerId) return false;
    
    // Show if explicitly marked as past meeting
    if (m.isPastMeeting) return true;
    
    // Or if meeting has already ended
    const meetingDate = new Date(m.date);
    const meetingDuration = m.duration || 60;
    const meetingEndTime = new Date(meetingDate.getTime() + meetingDuration * 60000);
    
    return meetingEndTime < now;
});


// Filter by current tab
if (state.currentMeetingTab === 'individual') {
        // Individual meetings have no tab assigned
        customerMeetings = customerMeetings.filter(m => !m.tabId || m.tabId === 'individual');
    } else if (state.currentMeetingTab !== 'all') {
        // Filter by specific tab
        customerMeetings = customerMeetings.filter(m => m.tabId === state.currentMeetingTab);
    }
    
    if (customerMeetings.length === 0 && state.currentMeetingTab === 'all') {
    section.classList.add('empty');
    container.innerHTML = '';
    empty.removeAttribute('style'); 
    empty.className = 'empty-state-compact';
    empty.innerHTML = `
        <div class="empty-state-compact-icon"></div>
        <div></div>
        <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; margin-top:0.5rem;">
            <button class="btn-schedule-meeting" onclick="openInlineMeetingFormForCustomer('${customerId}')" style="display:inline-flex;">
                <span>+</span>
                <span>Meeting</span>
            </button>
            <button class="btn-schedule-meeting" onclick="openPhoneCallModal('${customerId}')" style="display:inline-flex;">
                <span>+</span>
                <span>Call</span>
            </button>
        </div>
    `;

        
        // Clean up ALL buttons from header when empty
        const sectionHeader = section.querySelector('.customer-section-header');
        if (sectionHeader) {
            const existingWrapper = sectionHeader.querySelector('.section-header-right');
            if (existingWrapper) {
                existingWrapper.remove();
            }
            // Remove any stray buttons
            const strayBtns = sectionHeader.querySelectorAll('.btn-add-meeting');
            strayBtns.forEach(btn => btn.remove());
        }
    } else {
        empty.removeAttribute('style');
        empty.style.display = 'none';
        
        // Render tabs
const tabsHTML = `
    <div class="meeting-tabs-container">
        ${state.meetingTabs.map(tab => {
            const tabMeetings = tab.id === 'all' 
                ? state.meetings.filter(m => m.customerId === customerId)
                : tab.id === 'individual'
                ? state.meetings.filter(m => m.customerId === customerId && (!m.tabId || m.tabId === 'individual'))
                : state.meetings.filter(m => m.customerId === customerId && m.tabId === tab.id);
            
            return `
                <div class="meeting-tab ${state.currentMeetingTab === tab.id ? 'active' : ''}" 
                     data-tab-id="${tab.id}"
                     onclick="switchMeetingTab('${tab.id}')"
                     oncontextmenu="showTabContextMenu(event, '${tab.id}'); return false;"
                     ondragover="handleTabDragOver(event, '${tab.id}')"
                     ondragleave="handleTabDragLeave(event)"
                     ondrop="handleTabDrop(event, '${tab.id}')">
                    ${tab.icon ? `<span class="meeting-tab-icon">${tab.icon}</span>` : ''}
                    <span>${escapeHtml(tab.name)}</span>
                    <span class="meeting-tab-count">${tabMeetings.length}</span>
                    ${!tab.isDefault ? `
                        <div class="meeting-tab-edit" onclick="event.stopPropagation(); openCreateTabModal('${tab.id}', event)" title="Edit tab">
                            <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2;">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </div>
                        <div class="meeting-tab-actions" onclick="event.stopPropagation(); deleteTabQuick('${tab.id}')" title="Delete tab">×</div>
                    ` : ''}
                </div>
            `;
        }).join('')}
        <button class="btn-add-tab" onclick="openCreateTabModal(null, event)">
            <span>Create</span>
            <span>Thread</span>
        </button>
${customerMeetings.length >= 2 ? `
    <button class="btn-view-all-notes" onclick="openConsolidatedNotesModal('${customerId}')">
        
        <span>View all Notes</span>
    </button>
` : ''}
    </div>
    <div class="meetings-drop-zone" id="meetingsDropZone">
        <span class="icon icon-download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span> Drop meeting here to move to "${state.meetingTabs.find(t => t.id === state.currentMeetingTab)?.name}"
    </div>
`;
        
        // Empty state for non-all tabs
        if (customerMeetings.length === 0) {
            container.innerHTML = tabsHTML + `
                <div class="meetings-empty-tab">
                    <div class="meetings-empty-tab-icon"><span class="icon icon-folder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span></div>
                    <div>No meetings in "${state.meetingTabs.find(t => t.id === state.currentMeetingTab)?.name}" yet</div>
                    <div style="margin-top: 1rem; font-size: 0.85rem;">Drag meetings here or click + Meeting</div>
                </div>
            `;
        } else {
            // Create grid container
            container.innerHTML = tabsHTML + '<div class="meetings-overview-grid">' + 
                customerMeetings.map(meeting => {
                    const meetingDate = new Date(meeting.date);
                    const meddpiccScore = calculateMEDDPICCCompletion(meeting);
                    const notesText = (meeting.notesHTML ? htmlToPlainText(meeting.notesHTML) : meeting.notes || '').trim();
                    const hasNotes = notesText.trim().length > 0;
const typeIcons = {
    discovery: '<span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>',
    'follow-up': '<span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>'
};
const typeIcon = typeIcons[meeting.type] || (meeting.customTypeIcon || '<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span>');                    
                    return `
                        <div class="customer-meeting-summary" 
                             draggable="true"
                             data-meeting-id="${meeting.id}"
                             ondragstart="handleMeetingDragStart(event, '${meeting.id}')"
                             ondragend="handleMeetingDragEnd(event)">
                            <div class="meeting-summary-actions">


          
                                <button class="meeting-action-btn" onclick="event.stopPropagation(); editMeetingFromCustomer('${meeting.id}')" title="Edit">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="meeting-action-btn" onclick="event.stopPropagation(); exportMeetingFromList('${meeting.id}')" title="Export">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                </button>
                                <button class="meeting-action-btn delete" onclick="event.stopPropagation(); deleteMeetingFromCustomer('${meeting.id}')" title="Delete">
                                    <svg viewBox="0 0 24 24">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>

                    <!-- ========== SHARING FEATURE - START ========== -->
                    ${meeting.type !== 'phone-call' ? `<button class="meeting-action-btn share" onclick="event.stopPropagation(); openShareModal('${meeting.id}')" title="Share">
                        <svg viewBox="0 0 24 24">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" y1="2" x2="12" y2="15"></line>
                        </svg>
                    </button>` : ''}
                    <!-- ========== SHARING FEATURE - END ========== -->
                            </div>
                            
                            <div class="meeting-summary-title">
                                ${escapeHtml(meeting.title)}
                            </div>
                            
<div class="meeting-summary-date">
    ${getCalendarSVG(14)} ${meetingDate.toLocaleDateString()} ${meeting.duration ? `• ${meeting.duration}min` : ''} ${meeting.type ? `• ${typeIcon} ${meeting.type.replace('-', ' ')}` : ''}
</div>
                            
${hasNotes ? `
    <div class="meeting-summary-notes">
        <div class="meeting-summary-notes-content" id="meeting-notes-${meeting.id}">${escapeHtml(notesText)}</div>
        ${(notesText.length > 150 || notesText.split('\n').length > 3) ? `
            <button class="meeting-summary-notes-toggle" onclick="event.stopPropagation(); toggleMeetingNotesExpand('${meeting.id}', this)">
                Show More ▼
            </button>
        ` : ''}
    </div>
` : `
                                <div class="meeting-summary-notes">
                                    <div style="text-align: center; opacity: 0.7; font-style: italic;">
                                        No notes
                                    </div>
                                </div>
                            `}
                            
                            ${meeting.participants && meeting.participants.length > 0 ? `
                                <div class="meeting-summary-notes" style="padding: 0;">
                                    <button class="meeting-summary-notes-toggle" onclick="event.stopPropagation(); toggleMeetingParticipants('${meeting.id}', this)" style="width: 100%; margin: 0;" data-count="${meeting.participants.length}">
                                        <span class="icon icon-users"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span> Show Participants (${meeting.participants.length}) ▼
                                    </button>
                                    <div class="meeting-summary-notes-content" id="meeting-participants-${meeting.id}" style="padding: 0; max-height: 0; overflow: hidden;">
                                        ${meeting.participants.map(p => {
                                            const details = [];
                                            if (p.role) details.push(p.role);
                                            if (p.email) details.push(p.email);
                                            if (p.phone) details.push(p.phone);
                                            return `<div style="margin-bottom: 0.5rem;"><strong>${escapeHtml(p.name)}</strong>${details.length > 0 ? '<br>' + escapeHtml(details.join(' • ')) : ''}</div>`;
                                        }).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                        </div>
                    `;
                }).join('') + '</div>';
        }
        
        // Add buttons to section header - FIXED VERSION
const sectionHeader = section.querySelector('.customer-section-header');
if (sectionHeader) {
    // Find and preserve the existing toggle BEFORE removing anything
    let toggle = sectionHeader.querySelector('.customer-section-toggle');
    
    // Remove existing buttons and wrapper
    const existingBtn = sectionHeader.querySelector('.btn-add-meeting');
    const existingWrapper = sectionHeader.querySelector('.section-header-right');
    if (existingBtn) existingBtn.remove();
    if (existingWrapper) existingWrapper.remove();
    
    // If toggle was removed with wrapper, recreate it
    toggle = sectionHeader.querySelector('.customer-section-toggle');
    if (!toggle) {
        toggle = document.createElement('div');
        toggle.className = 'customer-section-toggle';
        toggle.textContent = '▼';
    }
    
    // Create wrapper for buttons and toggle
    const rightWrapper = document.createElement('div');
    rightWrapper.className = 'section-header-right';
    rightWrapper.style.display = 'flex';
    rightWrapper.style.alignItems = 'center';
    rightWrapper.style.gap = '0.5rem';
    
    // Create add meeting button
   const addBtn = document.createElement('button');
addBtn.className = 'btn-add-meeting';
addBtn.innerHTML = '+ Meeting';
addBtn.onclick = (e) => {
    e.stopPropagation();
    openInlineMeetingFormForCustomer(customerId);
};

// + Call button
const callBtn = document.createElement('button');
callBtn.className = 'btn-add-meeting';
callBtn.innerHTML = '+ Call';
callBtn.onclick = (e) => {
    e.stopPropagation();
    openPhoneCallModal(customerId);
};

// Create follow-up button
const followUpBtn = document.createElement('button');
followUpBtn.className = 'btn-add-meeting';
followUpBtn.innerHTML = '+ Follow-Up';
followUpBtn.onclick = (e) => {
    e.stopPropagation();
    openFollowUpModal('past');
};

rightWrapper.appendChild(addBtn);
rightWrapper.appendChild(callBtn);
rightWrapper.appendChild(followUpBtn);
rightWrapper.appendChild(toggle);
sectionHeader.appendChild(rightWrapper);

}
    }
    
    section.classList.add('active');
    
    // Add count badge to title (total meetings across all tabs)
    const allCustomerMeetings = state.meetings.filter(m => m.customerId === customerId);
    const sectionTitle = section.querySelector('.customer-section-title');
    if (sectionTitle) {
        const oldBadge = sectionTitle.querySelector('.section-count-badge');
        if (oldBadge) oldBadge.remove();
        
        if (allCustomerMeetings.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'section-count-badge';
            badge.textContent = `(${allCustomerMeetings.length})`;
            sectionTitle.appendChild(badge);
        }
    }
}


        function hideCustomerMeetingsSection() {
            document.getElementById('customerMeetingsSection').classList.remove('active');
        }

        function toggleMeetingExpand(meetingId) {
            const content = document.getElementById(`meeting-content-${meetingId}`);
            const btn = event.currentTarget;
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                btn.textContent = 'More';
            } else {
                content.classList.add('expanded');
                btn.textContent = 'Less';
            }
        }

function editMeetingFromCustomer(meetingId) {
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    if (meeting.type === 'phone-call') {
        openPhoneCallModalForEdit(meeting);
    } else {
        openInlineMeetingForm(meeting);
    }
}

function openPhoneCallModalForEdit(meeting) {
    callContacts = meeting.participants ? [...meeting.participants] : [];
    callActions = [];
    callSelectedCustomerId = meeting.customerId;

    // Load existing action items from tasks
    const existingTasks = state.tasks.filter(t => t.meetingId === meeting.id);
    callActions = existingTasks.map(t => t.title);

    // Set customer
    document.getElementById('callCustomerInput').value = meeting.customerName || '';

    // Set date
    document.getElementById('callDate').value = meeting.date;

    // Set mode
    const mode = meeting.connected ? 'connected' : 'not-connected';
    document.getElementById('callMode').value = mode;

    // Set duration or reason
    if (meeting.connected) {
        document.getElementById('callDuration').value = meeting.duration || '';
    } else {
        document.getElementById('callReason').value = meeting.reason || 'No Answer';
    }

    // Set notes
    document.getElementById('callNotes').value = meeting.notes || '';

    // Store the id so submit knows we are editing
    document.getElementById('callId').value = meeting.id;

    // Render lists
    renderCallContactsList();
    renderCallActionsList();

    // Load quick-add contacts
    if (meeting.customerId) {
        loadCallQuickAddContacts(meeting.customerId);
    }

    // Apply mode visuals
    setCallMode(mode);

    // Setup combobox
    setupCallCustomerCombobox();

    document.getElementById('phoneCallModal').classList.add('active');
}


        function calculateMEDDPICCCompletion(meeting) {
            const fields = [
                meeting.meddpicc?.metrics,
                meeting.meddpicc?.economicBuyer,
                meeting.meddpicc?.decisionCriteria,
                meeting.meddpicc?.decisionProcess,
                meeting.meddpicc?.paperProcess,
                meeting.meddpicc?.pain,
                meeting.meddpicc?.champion,
                meeting.meddpicc?.competition
            ];
            const completed = fields.filter(field => field && field.trim()).length;
            return {
                completed,
                total: 8,
                percentage: Math.round((completed / 8) * 100)
            };
        }

        function setupColorPicker() {
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                    state.selectedColor = option.dataset.color;
                    document.getElementById('taskColor').value = state.selectedColor;
                });
            });
        }

function setupCustomerCombobox() {
    const input = document.getElementById('meetingCustomerInput');
    const dropdown = document.getElementById('customerDropdown');
    input.addEventListener('focus', () => {
        updateCustomerDropdown(input.value);
        dropdown.classList.add('active');
    });
            input.addEventListener('input', () => {
                updateCustomerDropdown(input.value);
                dropdown.classList.add('active');
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.customer-combobox')) {
                    dropdown.classList.remove('active');
                }
            });
        }

        function setupTaskCustomerCombobox() {
            const input = document.getElementById('taskCustomerInput');
            const dropdown = document.getElementById('taskCustomerDropdown');
input.addEventListener('focus', () => {
    updateTaskCustomerDropdown(input.value);
    dropdown.classList.add('active');
});
            input.addEventListener('input', () => {
                updateTaskCustomerDropdown(input.value);
                dropdown.classList.add('active');
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#taskCustomerInput') && !e.target.closest('#taskCustomerDropdown')) {
                    dropdown.classList.remove('active');
                }
            });
        }

        function setupCustomerInfoCustomerCombobox() {
            const input = document.getElementById('CustomerInfoCustomerInput');
            const dropdown = document.getElementById('CustomerInfoCustomerDropdown');
input.addEventListener('focus', () => {
    updateCustomerInfoCustomerDropdown(input.value);
    dropdown.classList.add('active');
});
            input.addEventListener('input', () => {
                updateCustomerInfoCustomerDropdown(input.value);
                dropdown.classList.add('active');
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#CustomerInfoCustomerInput') && !e.target.closest('#CustomerInfoCustomerDropdown')) {
                    dropdown.classList.remove('active');
                }
            });
        }

        function updateCustomerDropdown(searchTerm = '') {
            const dropdown = document.getElementById('customerDropdown');
            const filteredCustomers = state.customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
            let html = '';
            if (searchTerm && !filteredCustomers.some(c => c.name.toLowerCase() === searchTerm.toLowerCase())) {
                html += `<div class="customer-dropdown-item new-customer" onclick="selectNewCustomer('${escapeHtml(searchTerm)}')"><span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span> Add "${escapeHtml(searchTerm)}"</div>`;
            }
            filteredCustomers.forEach(customer => {
                html += `
                    <div class="customer-dropdown-item" onclick="selectExistingCustomer('${customer.id}')">
                        <div class="customer-dropdown-item-name">${escapeHtml(customer.name)}</div>
                        ${customer.email ? `<div class="customer-dropdown-item-email">${escapeHtml(customer.email)}</div>` : ''}
                    </div>
                `;
            });
            if (filteredCustomers.length === 0 && !searchTerm) {
                html = '<div class="customer-dropdown-item" style="text-align: center; color: var(--text-secondary); font-size: 0.75rem;">No customers</div>';
            }
            dropdown.innerHTML = html;
        }

        function updateTaskCustomerDropdown(searchTerm = '') {
            const dropdown = document.getElementById('taskCustomerDropdown');
            const filteredCustomers = state.customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
            let html = '';
            if (searchTerm && !filteredCustomers.some(c => c.name.toLowerCase() === searchTerm.toLowerCase())) {
                html += `<div class="customer-dropdown-item new-customer" onclick="selectNewTaskCustomer('${escapeHtml(searchTerm)}')"><span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span> Add "${escapeHtml(searchTerm)}"</div>`;
            }
            filteredCustomers.forEach(customer => {
                html += `
                    <div class="customer-dropdown-item" onclick="selectExistingTaskCustomer('${customer.id}')">
                        <div class="customer-dropdown-item-name">${escapeHtml(customer.name)}</div>
                        ${customer.email ? `<div class="customer-dropdown-item-email">${escapeHtml(customer.email)}</div>` : ''}
                    </div>
                `;
            });
            if (filteredCustomers.length === 0 && !searchTerm) {
                html = '<div class="customer-dropdown-item" style="text-align: center; color: var(--text-secondary); font-size: 0.75rem;">No customers</div>';
            }
            dropdown.innerHTML = html;
        }

        function updateCustomerInfoCustomerDropdown(searchTerm = '') {
            const dropdown = document.getElementById('CustomerInfoCustomerDropdown');
            const filteredCustomers = state.customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
            let html = '';
            if (searchTerm && !filteredCustomers.some(c => c.name.toLowerCase() === searchTerm.toLowerCase())) {
                html += `<div class="customer-dropdown-item new-customer" onclick="selectNewCustomerInfoCustomer('${escapeHtml(searchTerm)}')"><span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span> Add "${escapeHtml(searchTerm)}"</div>`;
            }
            filteredCustomers.forEach(customer => {
                html += `
                    <div class="customer-dropdown-item" onclick="selectExistingCustomerInfoCustomer('${customer.id}')">
                        <div class="customer-dropdown-item-name">${escapeHtml(customer.name)}</div>
                        ${customer.email ? `<div class="customer-dropdown-item-email">${escapeHtml(customer.email)}</div>` : ''}
                    </div>
                `;
            });
            if (filteredCustomers.length === 0 && !searchTerm) {
                html = '<div class="customer-dropdown-item" style="text-align: center; color: var(--text-secondary); font-size: 0.75rem;">No customers</div>';
            }
            dropdown.innerHTML = html;
        }

                function selectExistingCustomer(customerId) {
            const customer = state.customers.find(c => c.id === customerId);
            if (customer) {
                document.getElementById('meetingCustomerInput').value = customer.name;
                state.selectedCustomerId = customerId;
                document.getElementById('customerDropdown').classList.remove('active');
                loadCustomerInfoForCustomer(customerId);
                loadCustomerContacts(customerId);
            }
        }

              function selectNewCustomer(customerName) {
    document.getElementById('meetingCustomerInput').value = customerName;
    state.selectedCustomerId = null;
    document.getElementById('customerDropdown').classList.remove('active');
    document.getElementById('CustomerInfoTab').style.display = 'flex';
    document.getElementById('CustomerInfoContent').innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"><span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span></div>
            <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.85rem;">No customer info yet. Save the meeting first to add prep.</p>
        </div>
    `;
    
    // Hide quick-add contacts for new customer
    const container = document.getElementById('quickAddContactsContainer');
    if (container) container.classList.remove('active');
}


        function loadCustomerContacts(customerId) {
            const container = document.getElementById('quickAddContactsContainer');
            const list = document.getElementById('quickAddContactsList');
            
            if (!customerId) {
                container.classList.remove('active');
                return;
            }
            
            const customer = state.customers.find(c => c.id === customerId);
            if (!customer) {
                container.classList.remove('active');
                return;
            }
            
            // Collect all unique contacts for this customer
            const contactsMap = new Map();
            
            // Add standalone contacts
            if (customer.participants) {
                customer.participants.forEach(p => {
                    const key = p.email && p.email.trim() 
                        ? p.email.toLowerCase().trim() 
                        : p.name.toLowerCase().trim();
                    if (!contactsMap.has(key)) {
                        contactsMap.set(key, p);
                    }
                });
            }
            
            // Add contacts from previous meetings
            const customerMeetings = state.meetings.filter(m => m.customerId === customerId);
            customerMeetings.forEach(meeting => {
                if (meeting.participants) {
                    meeting.participants.forEach(p => {
                        const key = p.email && p.email.trim() 
                            ? p.email.toLowerCase().trim() 
                            : p.name.toLowerCase().trim();
                        if (!contactsMap.has(key)) {
                            contactsMap.set(key, p);
                        }
                    });
                }
            });
            
            const contacts = Array.from(contactsMap.values());
            
            if (contacts.length === 0) {
                container.classList.remove('active');
                return;
            }
            
            // Filter out contacts already added to this meeting
            const availableContacts = contacts.filter(contact => {
                const key = contact.email && contact.email.trim() 
                    ? contact.email.toLowerCase().trim() 
                    : contact.name.toLowerCase().trim();
                
                return !state.meetingParticipants.some(p => {
                    const pKey = p.email && p.email.trim() 
                        ? p.email.toLowerCase().trim() 
                        : p.name.toLowerCase().trim();
                    return pKey === key;
                });
            });
            
            if (availableContacts.length === 0) {
                container.classList.remove('active');
                return;
            }
            
            // Render contacts list
            list.innerHTML = availableContacts.map(contact => {
                const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const details = [];
                if (contact.role) details.push(contact.role);
                if (contact.email) details.push(contact.email);
                if (contact.phone) details.push(contact.phone);
                
                const contactJson = JSON.stringify(contact).replace(/"/g, '&quot;');
                
                return `
                    <div class="quick-add-contact-item" onclick='quickAddParticipant(${contactJson})'>
                        <div class="quick-add-contact-avatar">${initials}</div>
                        <div class="quick-add-contact-info">
                            <div class="quick-add-contact-name">${escapeHtml(contact.name)}</div>
                            ${details.length > 0 ? `<div class="quick-add-contact-details">${escapeHtml(details.join(' • '))}</div>` : ''}
                        </div>
                        <div class="quick-add-contact-icon"><span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span></div>
                    </div>
                `;
            }).join('');
            
            container.classList.add('active');
        }

        function quickAddParticipant(contactData) {
            // Check if already added
            const key = contactData.email && contactData.email.trim() 
                ? contactData.email.toLowerCase().trim() 
                : contactData.name.toLowerCase().trim();
            
            const alreadyAdded = state.meetingParticipants.some(p => {
                const pKey = p.email && p.email.trim() 
                    ? p.email.toLowerCase().trim() 
                    : p.name.toLowerCase().trim();
                return pKey === key;
            });
            
            if (alreadyAdded) {
                showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Already added', 'error');
                return;
            }
            
            // Add participant
            state.meetingParticipants.push({
                name: contactData.name,
                role: contactData.role || '',
                email: contactData.email || '',
                phone: contactData.phone || ''
            });
            
            renderParticipantsList();
            
            // Refresh the quick-add list (to remove this contact)
            if (state.selectedCustomerId) {
                loadCustomerContacts(state.selectedCustomerId);
            }
            
            showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> ${contactData.name} added!`, 'success');
        }

        function selectExistingTaskCustomer(customerId) {
            const customer = state.customers.find(c => c.id === customerId);
            if (customer) {
                document.getElementById('taskCustomerInput').value = customer.name;
                state.selectedTaskCustomerId = customerId;
                document.getElementById('taskCustomerDropdown').classList.remove('active');
            }
        }

        function selectNewTaskCustomer(customerName) {
            document.getElementById('taskCustomerInput').value = customerName;
            state.selectedTaskCustomerId = null;
            document.getElementById('taskCustomerDropdown').classList.remove('active');
        }

        function selectExistingCustomerInfoCustomer(customerId) {
            const customer = state.customers.find(c => c.id === customerId);
            if (customer) {
                document.getElementById('CustomerInfoCustomerInput').value = customer.name;
                state.selectedCustomerInfoCustomerId = customerId;
                document.getElementById('CustomerInfoCustomerDropdown').classList.remove('active');
            }
        }

        function selectNewCustomerInfoCustomer(customerName) {
            document.getElementById('CustomerInfoCustomerInput').value = customerName;
            state.selectedCustomerInfoCustomerId = null;
            document.getElementById('CustomerInfoCustomerDropdown').classList.remove('active');
        }

       function loadCustomerInfoForCustomer(customerId) {
    const CustomerInfo = state.CustomerInfos.find(p => p.customerId === customerId);
    const CustomerInfoTab = document.getElementById('CustomerInfoTab');
    const CustomerInfoContent = document.getElementById('CustomerInfoContent');
    
    // Always show the tab when we have a customer
    CustomerInfoTab.style.display = 'flex';
    
    if (CustomerInfo) {
        CustomerInfoContent.innerHTML = `
            <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem; color: white; font-weight: 600; font-size: 0.8rem;">
                <span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> Customer Info Available
            </div>
            <div style="margin-bottom: 0.75rem;">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">BACKGROUND</div>
                <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: 6px; white-space: pre-wrap; font-size: 0.8rem;">${escapeHtml(CustomerInfo.background || '')}</div>
            </div>
            ${CustomerInfo.discussionPoints ? `
                <div style="margin-bottom: 0.75rem;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">DISCUSSION POINTS</div>
                    <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: 6px; white-space: pre-wrap; font-size: 0.8rem;">${escapeHtml(CustomerInfo.discussionPoints)}</div>
                </div>
            ` : ''}
            ${CustomerInfo.materials ? `
                <div style="margin-bottom: 0.75rem;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">COMPETITIVE INTELLIGENCE</div>
                    <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: 6px; white-space: pre-wrap; font-size: 0.8rem;">${escapeHtml(CustomerInfo.materials)}</div>
                </div>
            ` : ''}
            ${CustomerInfo.outcomes ? `
                <div style="margin-bottom: 0.75rem;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">EXPECTED OUTCOMES</div>
                    <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: 6px; white-space: pre-wrap; font-size: 0.8rem;">${escapeHtml(CustomerInfo.outcomes)}</div>
                </div>
            ` : ''}
            <button type="button" class="btn btn-secondary" onclick="editCustomerInfoFromMeeting('${CustomerInfo.id}')" style="width: 100%;"><span class="icon icon-pencil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></span> Edit Customer Info</button>
        `;
    } else {
        // No CustomerInfo exists - show option to create one
        CustomerInfoContent.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"><span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span></div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.85rem;">No customer info for this meeting yet</p>
                <button type="button" class="btn btn-primary" onclick="createCustomerInfoForMeeting('${customerId}')" style="width: 100%;">
                    <span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span> Create Customer Info
                </button>
            </div>
        `;
    }
}

function createCustomerInfoForMeeting(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Save current meeting form data
    state.savedMeetingFormData = {
        meetingId: document.getElementById('meetingId').value, // **IMPORTANT: Save the meeting ID**
        customerId: customerId,
        customerName: customer.name,
        title: document.getElementById('meetingTitle').value,
        date: document.getElementById('meetingDate').value,
        type: document.getElementById('meetingType').value,
        duration: document.getElementById('meetingDuration').value,
        notesHTML: getEditorHTML('meetingNotesEditor'),
        nextStepsHTML: getEditorHTML('meetingNextStepsEditor'),
        participants: [...state.meetingParticipants],
        tasks: [...state.meetingTasks],
        markedCompleted: document.getElementById('meetingMarkCompleted').checked,
        meddpicc: {
            metrics: document.getElementById('meddpiccMetrics').value,
            economicBuyer: document.getElementById('meddpiccEconomicBuyer').value,
            decisionCriteria: document.getElementById('meddpiccDecisionCriteria').value,
            decisionProcess: document.getElementById('meddpiccDecisionProcess').value,
            paperProcess: document.getElementById('meddpiccPaperProcess').value,
            pain: document.getElementById('meddpiccPain').value,
            champion: document.getElementById('meddpiccChampion').value,
            competition: document.getElementById('meddpiccCompetition').value
        }
    };
    
    // Mark that we're coming from meeting form
    state.returningToMeetingForm = true;
    
    // Close meeting form and open CustomerInfo form for this customer
    closeInlineMeetingForm();
    openInlineCustomerInfoFormForCustomer(customerId);
    
    showToast('<span class="icon icon-lightbulb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg></span> Create customer info to prepare for the meeting', 'success');
}


function restoreMeetingForm() {
    const data = state.savedMeetingFormData;
    if (!data) return;
    
    // **FIX: Check if we were editing an existing meeting**
    const isEditingExisting = data.meetingId && data.meetingId.trim() !== '';
    
    if (isEditingExisting) {
        // **EDITING EXISTING MEETING - Just reopen it with the same ID**
        const existingMeeting = state.meetings.find(m => m.id === data.meetingId);
        
        if (existingMeeting) {
            // Update the meeting data with any changes made before creating CustomerInfo
            existingMeeting.title = data.title;
            existingMeeting.date = data.date;
            existingMeeting.type = data.type;
            existingMeeting.duration = data.duration;
            existingMeeting.notesHTML = data.notesHTML;
            existingMeeting.notes = htmlToPlainText(data.notesHTML);
            existingMeeting.nextStepsHTML = data.nextStepsHTML;
            existingMeeting.nextSteps = htmlToPlainText(data.nextStepsHTML);
            existingMeeting.followUpDate = data.followUpDate;
            existingMeeting.outcome = data.outcome;
            existingMeeting.participants = data.participants;
            existingMeeting.meddpicc = data.meddpicc;
            
            // Save the updates
            saveData();
            
            // Reopen the meeting form for editing
            openInlineMeetingForm(existingMeeting);
            
            // Switch to CustomerInfo tab
            setTimeout(() => {
                document.querySelectorAll('#inlineMeetingForm .modal-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('#inlineMeetingForm .tab-content').forEach(c => c.classList.remove('active'));
                document.querySelector('#inlineMeetingForm .modal-tab[data-tab="CustomerInfo"]').classList.add('active');
                document.querySelector('#inlineMeetingForm [data-tab-content="CustomerInfo"]').classList.add('active');
            }, 100);
            
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer Info saved! Returning to meeting', 'success');
        } else {
            // Meeting not found, treat as new
            createNewMeetingFromSavedData(data);
        }
    } else {
        // **CREATING NEW MEETING**
        createNewMeetingFromSavedData(data);
    }
    
    // Clear the saved state
    state.returningToMeetingForm = false;
    state.savedMeetingFormData = null;
    
    window.scrollTo(0, 0);
}

// **NEW HELPER FUNCTION** - Extract the "create new meeting" logic
function createNewMeetingFromSavedData(data) {
    // Restore state
    state.selectedCustomerId = data.customerId;
    state.meetingParticipants = data.participants;
    state.meetingTasks = data.tasks;
    
    // Open the meeting form
    hideUpcomingMeetings();
    hideCustomerParticipantsSection();
    document.getElementById('inlineCustomerInfoForm').classList.remove('active');

    document.getElementById('customerCustomerInfosSection').classList.remove('active');
    document.getElementById('customerMeetingsSection').classList.remove('active');
    document.querySelector('.tasks-section').style.display = 'none';
    document.getElementById('notesContainer').classList.add('hidden');
    document.getElementById('mainContainer').classList.add('form-mode');
    
    // Set title
    const titleElement = document.getElementById('meetingFormTitle');
    if (titleElement) {
        titleElement.innerHTML = '<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> New Meeting';
    }
    
    // Restore form values
    document.getElementById('meetingForm').reset();
    document.getElementById('meetingId').value = ''; // **IMPORTANT: Empty ID = new meeting**
    document.getElementById('meetingCustomerInput').value = data.customerName;
    document.getElementById('meetingTitle').value = data.title;
    document.getElementById('meetingDate').value = data.date;
    document.getElementById('meetingType').value = data.type;
    document.getElementById('meetingDuration').value = data.duration;
    document.getElementById('meetingMarkCompleted').checked = data.markedCompleted || false;
    
    // Restore editors
    setEditorHTML('meetingNotesEditor', data.notesHTML);
    setEditorHTML('meetingNextStepsEditor', data.nextStepsHTML);
    
    // Restore MEDDPICC
    document.getElementById('meddpiccMetrics').value = data.meddpicc.metrics;
    document.getElementById('meddpiccEconomicBuyer').value = data.meddpicc.economicBuyer;
    document.getElementById('meddpiccDecisionCriteria').value = data.meddpicc.decisionCriteria;
    document.getElementById('meddpiccDecisionProcess').value = data.meddpicc.decisionProcess;
    document.getElementById('meddpiccPaperProcess').value = data.meddpicc.paperProcess;
    document.getElementById('meddpiccPain').value = data.meddpicc.pain;
    document.getElementById('meddpiccChampion').value = data.meddpicc.champion;
    document.getElementById('meddpiccCompetition').value = data.meddpicc.competition;
    
    // Render participants and tasks
    renderParticipantsList();
    renderMeetingTasksList();
    
    // Load CustomerInfo (now it should exist!)
    loadCustomerInfoForCustomer(data.customerId);
    
    // Show the form
    document.getElementById('inlineMeetingForm').classList.add('active');
    
    // Switch to CustomerInfo tab
    document.querySelectorAll('#inlineMeetingForm .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#inlineMeetingForm .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('#inlineMeetingForm .modal-tab[data-tab="CustomerInfo"]').classList.add('active');
    document.querySelector('#inlineMeetingForm [data-tab-content="CustomerInfo"]').classList.add('active');
    
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer Info saved! Now showing in Prep tab', 'success');
}

        function editCustomerInfoFromMeeting(CustomerInfoId) {
            const CustomerInfo = state.CustomerInfos.find(p => p.id === CustomerInfoId);
            if (CustomerInfo) {
                closeInlineMeetingForm();
                openInlineCustomerInfoForm(CustomerInfo);
            }
        }

        function openTagsOverviewModal() {
            renderTagsOverview();
            document.getElementById('tagsOverviewModal').classList.add('active');
        }

        function closeTagsOverviewModal() {
            document.getElementById('tagsOverviewModal').classList.remove('active');
            state.selectedTag = null;
        }

        function renderTagsOverview() {
            const tagsMap = new Map();
            state.meetings.forEach(meeting => {
                if (meeting.tags && meeting.tags.length > 0) {
                    meeting.tags.forEach(tag => {
                        if (!tagsMap.has(tag)) {
                            tagsMap.set(tag, []);
                        }
                        tagsMap.get(tag).push({
                            meetingId: meeting.id,
                            customerId: meeting.customerId,
                            customerName: meeting.customerName,
                            meetingTitle: meeting.title,
                            meetingDate: meeting.date
                        });
                    });
                }
            });
            const tagsContainer = document.getElementById('tagsListContainer');
            const emptyState = document.getElementById('tagsEmpty');
            if (tagsMap.size === 0) {
                tagsContainer.innerHTML = '';
                emptyState.style.display = 'block';
                document.getElementById('selectedTagTitle').textContent = 'No tags';
                document.getElementById('customersByTagContainer').innerHTML = '';
                return;
            }
            emptyState.style.display = 'none';
            const sortedTags = Array.from(tagsMap.entries()).sort((a, b) => b[1].length - a[1].length);
            tagsContainer.innerHTML = sortedTags.map(([tag, meetings]) => `
                <div class="tag-item" onclick="selectTag('${escapeHtml(tag)}')">
                    <span class="tag-item-name"><span class="icon icon-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span> ${escapeHtml(tag)}</span>
                    <span class="tag-item-count">${meetings.length}</span>
                </div>
            `).join('');
            if (!state.selectedTag && sortedTags.length > 0) {
                selectTag(sortedTags[0][0]);
            } else if (state.selectedTag) {
                selectTag(state.selectedTag);
            }
        }

        function selectTag(tag) {
            state.selectedTag = tag;
            document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
            event.currentTarget?.classList.add('active');
            document.getElementById('selectedTagTitle').textContent = `Tag: ${tag}`;
            const meetingsWithTag = state.meetings.filter(m => m.tags && m.tags.includes(tag));
            const customerMeetings = new Map();
            meetingsWithTag.forEach(meeting => {
                if (meeting.customerId) {
                    if (!customerMeetings.has(meeting.customerId)) {
                        customerMeetings.set(meeting.customerId, {
                            customerName: meeting.customerName,
                            meetings: []
                        });
                    }
                    customerMeetings.get(meeting.customerId).meetings.push(meeting);
                }
            });
            const container = document.getElementById('customersByTagContainer');
            if (customerMeetings.size === 0) {
                container.innerHTML = '<div class="empty-state" style="padding: 1rem;"><div class="empty-state-icon"><span class="icon icon-users"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span></div><div>No customers</div></div>';
                return;
            }
            container.innerHTML = Array.from(customerMeetings.entries()).map(([customerId, data]) => `
                <div class="customer-tag-card">
                    <div class="customer-tag-header">
                        <div class="customer-tag-name"><span class="icon icon-building"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="8" y2="6"/><line x1="12" y1="6" x2="12" y2="6"/><line x1="16" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg></span> ${escapeHtml(data.customerName)}</div>
                        <div class="meetings-count-badge">${data.meetings.length}</div>
                    </div>
                    <div class="meetings-list-compact">
                        ${data.meetings.map(meeting => `
                            <div class="meeting-compact-item">
                                <strong>${escapeHtml(meeting.title)}</strong>
                                <div class="meeting-compact-date"><span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> ${new Date(meeting.date).toLocaleDateString()}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        function openCustomersModal() {
            renderCustomerList();
            document.getElementById('customersModal').classList.add('active');
        }

        function closeCustomersModal() {
            document.getElementById('customersModal').classList.remove('active');
        }

function openAddCustomerForm() {
    state.editingCustomer = null;
    document.getElementById('customerFormTitle').textContent = 'Add Customer';
    document.getElementById('customerForm').reset();
document.getElementById('customerId').value = '';
    document.getElementById('customerFormModal').classList.add('active');
}

       function openEditCustomerForm(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return;
    
    state.editingCustomer = customer;
    document.getElementById('customerFormTitle').textContent = 'Edit Customer Profile';
    document.getElementById('customerId').value = customer.id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerPhone').value = customer.phone || '';
    document.getElementById('customerWebsite').value = customer.website || '';
    document.getElementById('customerAddress').value = customer.address || '';
    document.getElementById('customerCity').value = customer.city || '';
    document.getElementById('customerState').value = customer.state || '';
    document.getElementById('customerZip').value = customer.zip || '';
    document.getElementById('customerCountry').value = customer.country || '';
    document.getElementById('customerIndustry').value = customer.industry || '';
    document.getElementById('customerSize').value = customer.size || '';
    document.getElementById('customerLinkedIn').value = customer.linkedIn || '';
    document.getElementById('customerMapsLink').value = customer.mapsLink || '';
    document.getElementById('customerFormModal').classList.add('active');
}

        function closeCustomerFormModal() {
            document.getElementById('customerFormModal').classList.remove('active');
            state.editingCustomer = null;
        }

       function handleCustomerSubmit(e) {
    e.preventDefault();


    
    const existingId = document.getElementById('customerId').value;
    const isEditing = state.editingCustomer && existingId;
    
    const customer = {
        id: existingId || Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        name: document.getElementById('customerName').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        website: document.getElementById('customerWebsite').value.trim(),
        address: document.getElementById('customerAddress').value.trim(),
        city: document.getElementById('customerCity').value.trim(),
        state: document.getElementById('customerState').value.trim(),
        zip: document.getElementById('customerZip').value.trim(),
        country: document.getElementById('customerCountry').value.trim(),
        industry: document.getElementById('customerIndustry').value.trim(),
        size: document.getElementById('customerSize').value,
        linkedIn: document.getElementById('customerLinkedIn').value.trim(),
        mapsLink: document.getElementById('customerMapsLink').value.trim(),
        createdAt: state.editingCustomer?.createdAt || new Date().toISOString()
    };
    
if (isEditing) {
    const index = state.customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
        const oldName = state.customers[index].name;
        customer.pinned = state.customers[index].pinned || false;        // was: possibly undefined
        customer.participants = state.customers[index].participants || []; // was: possibly undefined
        state.customers[index] = customer;

            
            // Sync name change to all references
            if (oldName !== customer.name) {
                state.tasks.forEach(t => { if (t.customerId === customer.id) t.customerName = customer.name; });
                state.meetings.forEach(m => { if (m.customerId === customer.id) m.customerName = customer.name; });
                state.CustomerInfos.forEach(p => { if (p.customerId === customer.id) p.customerName = customer.name; });
            }
        }
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer updated!', 'success');
    } else {
        // New customer - add to array
        state.customers.push(customer);
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer added!', 'success');
    }
    
    saveData();
    renderCustomerList();
    renderCustomerFilters();
    
    // Update banner if viewing this customer
    if (state.currentCustomer === customer.id) {
        updateCustomerBanner(customer.id);
    }
    
    closeCustomerFormModal();
    
    // Navigate to new customer after creation (not when editing)
    if (!isEditing) {
        closeCustomersModal();
        // Small delay to ensure UI updates
        setTimeout(() => {
            selectCustomerFromOverview(customer.id);
        }, 100);
    }
}



        function deleteCustomer(customerId) {
            showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete?', 'Delete customer?', () => {
                state.customers = state.customers.filter(c => c.id !== customerId);
                saveData();
                renderCustomerList();
                renderCustomerFilters();
                showToast('Deleted', 'success');
            });
        }

       function renderCustomerList() {
    const container = document.getElementById('customerList');
    const empty = document.getElementById('customersEmpty');
    if (state.customers.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    container.innerHTML = state.customers.map(customer => `
        <div class="customer-item">
            <div class="customer-info">
                <div class="customer-name">${escapeHtml(customer.name)}</div>
                ${customer.email ? `<div class="customer-email">${escapeHtml(customer.email)}</div>` : ''}
            </div>
            <div class="customer-actions">
                <button class="task-btn" onclick="openEditCustomerForm('${customer.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="task-btn delete" onclick="deleteCustomer('${customer.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function renderCustomerFilters() {
    const container = document.getElementById('customerFilters');
    const pinnedContainer = document.getElementById('pinnedCustomerFilters');
    const prioritySection = document.getElementById('priorityAccountsSection');
    
    const taskCounts = {};
    state.tasks.filter(t => !t.archived).forEach(task => {
        if (task.customerId) {
            taskCounts[task.customerId] = (taskCounts[task.customerId] || 0) + 1;
        }
    });
    
    // Get pinned customers only
    const pinnedCustomers = state.customers.filter(c => c.pinned);
    
    // Helper function to create customer button HTML
    const createCustomerButton = (customer, isPinned) => {
    const frozen = isCustomerFrozen(customer.id);
    return `
        <button class="category-filter ${isPinned ? 'pinned-customer' : ''} ${frozen ? 'frozen-customer' : ''}" data-customer="${customer.id}">
            <span class="pin-star ${isPinned ? 'pinned' : ''}" onclick="event.stopPropagation(); togglePinCustomer('${customer.id}', event)" title="${isPinned ? 'Unpin' : 'Pin to Priority'}">${isPinned ? '<span class="icon icon-star-filled"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>' : '<span class="icon icon-star-outline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>'}</span>
            <span class="category-filter-name">${escapeHtml(customer.name)}</span>
            <span class="customer-count">${taskCounts[customer.id] || 0}</span>
            <div class="customer-filter-actions">
                <div class="customer-filter-btn" onclick="event.stopPropagation(); openEditCustomerForm('${customer.id}')" title="Edit">
                    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
                <div class="customer-filter-btn delete" onclick="event.stopPropagation(); deleteCustomerFromSidebar('${customer.id}')" title="Delete">
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
            </div>
        </button>
    `;
};
    
    // Render pinned customers section
    if (pinnedCustomers.length > 0) {
        prioritySection.style.display = 'block';
        pinnedContainer.innerHTML = pinnedCustomers.map(customer => createCustomerButton(customer, true)).join('');
    } else {
        prioritySection.style.display = 'none';
        pinnedContainer.innerHTML = '';
    }
    
    // Clear the regular container (kept hidden for compatibility)
    container.innerHTML = '';

    // Add click listeners to pinned customer buttons only
    const pinnedButtons = pinnedContainer.querySelectorAll('.category-filter[data-customer]');

    pinnedButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const customerId = this.dataset.customer;
            
            // Close any open forms
            closeInlineMeetingForm();
            closeInlineCustomerInfoForm();
            
            // Update UI
            document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update state
            state.currentCustomer = customerId;
            state.currentMeetingTab = 'all';
            
            // Hide dashboard sections
            hideDashboardStats();
            hideCustomerActivity();
            hideAllCustomersSection();
            
            // Hide shared meetings section
            document.getElementById('sharedMeetingsSection')?.classList.remove('active');
            
            // Show customer-specific sections
            showUpcomingMeetings();
            showCustomerParticipantsSection(customerId);
            showCustomerCustomerInfosSection(customerId);
            showCustomerMeetingsSection(customerId);
            updateSectionTitle();
            
            // Render content
            renderTasks();
            renderNotes();
            renderTimeline();
        });
    });
    
renderCustomerSlots();
    // Refresh all customers list if visible
    if (document.getElementById('allCustomersSection').classList.contains('active')) {
        renderAllCustomersList();
    }
}


       function handleCustomerInfoSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.form-input, .form-textarea, .customer-combobox-input').forEach(el => {
        el.classList.remove('error');
    });
    document.querySelectorAll('.field-error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-section').forEach(el => el.classList.remove('error'));
    
    // Validation checks
    const validations = [
        {
            field: 'CustomerInfoCustomerInput',
            value: document.getElementById('CustomerInfoCustomerInput').value.trim(),
            message: 'Please enter a customer name',
            tab: 'info'
        },
        {
            field: 'CustomerInfoBackground',
            value: document.getElementById('CustomerInfoBackground').value.trim(),
            message: 'Please enter background information',
            tab: 'info'
        }
    ];
    
    // Find first error
    for (let validation of validations) {
        if (!validation.value) {
            // Switch to the correct tab
            const tabs = document.querySelectorAll('#inlineCustomerInfoForm .modal-tab[data-form="CustomerInfo"]');
            const contents = document.querySelectorAll('#inlineCustomerInfoForm .tab-content');
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            const targetTab = document.querySelector(`#inlineCustomerInfoForm .modal-tab[data-tab="${validation.tab}"][data-form="CustomerInfo"]`);
            const targetContent = document.querySelector(`#inlineCustomerInfoForm .tab-content[data-tab-content="${validation.tab}"]`);
            
            if (targetTab) {
                targetTab.classList.add('active');
                targetTab.click();
            }
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            state.currentCustomerInfoTab = validation.tab;
            
            setTimeout(() => {
                const field = document.getElementById(validation.field);
                if (field) {
                    field.classList.add('error');
                    
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'field-error-message';
                    errorMsg.innerHTML = `<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> ${validation.message}`;
                    
                    const parent = field.closest('.form-group') || field.closest('.form-section-content');
                    if (parent) {
                        parent.appendChild(errorMsg);
                        
                        const section = field.closest('.form-section');
                        if (section) {
                            section.classList.add('error');
                            section.classList.remove('collapsed');
                        }
                    }
                    
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => field.focus(), 300);
                }
            }, 200);
            
            showToast(`<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> ${validation.message}`, 'error');
            return;
        }
    }
    
    // All validation passed, proceed with save
    const customerInput = document.getElementById('CustomerInfoCustomerInput').value.trim();
    const background = document.getElementById('CustomerInfoBackground').value.trim();
    
    let customerId = state.selectedCustomerInfoCustomerId;
    let customerName = customerInput;
    
    if (!customerId && customerInput) {
        const newCustomer = {
            id: Date.now().toString(),
            name: customerInput,
            email: '',
            phone: '',
            company: '',
            notes: '',
            createdAt: new Date().toISOString()
        };
        state.customers.push(newCustomer);
        customerId = newCustomer.id;
        customerName = newCustomer.name;
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer created!', 'success');
    }
    
    const CustomerInfo = {
        id: document.getElementById('CustomerInfoId').value || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerId: customerId,
        customerName: customerName,
        background: background,
        discussionPoints: document.getElementById('CustomerInfoDiscussionPoints').value.trim(),
        materials: document.getElementById('CustomerInfoMaterials').value.trim(),
        outcomes: document.getElementById('CustomerInfoOutcomes').value.trim(),
        createdAt: state.editingCustomerInfo?.createdAt || new Date().toISOString()
    };
    
    if (state.editingCustomerInfo) {
        const index = state.CustomerInfos.findIndex(p => p.id === CustomerInfo.id);
        state.CustomerInfos[index] = CustomerInfo;
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer Info updated!', 'success');
    } else {
        const existingIndex = state.CustomerInfos.findIndex(p => p.customerId === customerId);
        if (existingIndex !== -1) {
            state.CustomerInfos[existingIndex] = CustomerInfo;
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer Info updated!', 'success');
        } else {
            state.CustomerInfos.unshift(CustomerInfo);
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer Info saved!', 'success');
        }
    }
    
        saveData();
    renderCustomerFilters();
    

    
    closeInlineCustomerInfoForm();
    
    // Check if we should return to meeting form
    if (state.returningToMeetingForm && state.savedMeetingFormData) {
        restoreMeetingForm();
    }
}

function handleMeetingSubmit(e) {
    e.preventDefault();
const isEditing = state.editingCustomer && document.getElementById('customerId').value;
if (!isEditing && !canAddCustomer()) { showLimitReachedModal(); return; }
    
    // Clear previous errors
    document.querySelectorAll('.form-input, .form-textarea, .customer-combobox-input').forEach(el => {
        el.classList.remove('error');
    });
    document.querySelectorAll('.field-error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-section').forEach(el => el.classList.remove('error'));
    
    // Get customer input
    const customerInput = document.getElementById('meetingCustomerInput').value.trim();
    
    // Define all validations
    const validations = [
        {
            field: 'meetingCustomerInput',
            value: customerInput,
            message: 'Please enter a customer name',
            tab: 'info',
            sectionIndex: 0
        },
        {
            field: 'meetingTitle',
            value: document.getElementById('meetingTitle').value.trim(),
            message: 'Please enter a meeting title',
            tab: 'info',
            sectionIndex: 1
        },
        {
            field: 'meetingDate',
            value: document.getElementById('meetingDate').value,
            message: 'Please select a date and time',
            tab: 'info',
            sectionIndex: 1
        },
        {
            field: 'meetingType',
            value: document.getElementById('meetingType').value,
            message: 'Please select a meeting type',
            tab: 'info',
            sectionIndex: 1
        }
    ];
    
    // **NEW: Only require notes for PAST meetings (not upcoming meetings)**
    if (state.meetingIsPastMeeting !== false) {
        validations.push({
            field: 'meetingNotesEditor',
            value: getEditorText('meetingNotesEditor'),
            message: 'Please enter meeting notes',
            tab: 'notes',
            sectionIndex: 0
        });
    }
    
    // Check for first validation error
    for (let validation of validations) {
        if (!validation.value) {
            console.log('Validation failed for:', validation.field); // DEBUG
            
            // Force switch to the correct tab
            const allTabs = document.querySelectorAll('#inlineMeetingForm .modal-tab[data-form="meeting"]');
            const allContents = document.querySelectorAll('#inlineMeetingForm .tab-content');
            
            // Remove active from all
            allTabs.forEach(t => t.classList.remove('active'));
            allContents.forEach(c => c.classList.remove('active'));
            
            // Activate the target tab
            const targetTab = document.querySelector(`#inlineMeetingForm .modal-tab[data-tab="${validation.tab}"][data-form="meeting"]`);
            const targetContent = document.querySelector(`#inlineMeetingForm .tab-content[data-tab-content="${validation.tab}"]`);
            
            if (targetTab && targetContent) {
                targetTab.classList.add('active');
                targetContent.classList.add('active');
                
                // **FIX: Update state to match the switched tab**
                state.currentMeetingTab = validation.tab;
                
                // Pulse animation on tab
                targetTab.style.animation = 'pulse 0.6s ease-in-out 3';
                setTimeout(() => {
                    targetTab.style.animation = '';
                }, 2000);
            }
            
            // Wait for tab to be visible, then highlight field
            setTimeout(() => {
                const field = document.getElementById(validation.field);
                if (field) {
                    // Add error styling
                    field.classList.add('error');
                    
                    // Find the parent container
                    const formGroup = field.closest('.form-group');
                    const formSection = field.closest('.form-section');
                    
                    // Expand section if collapsed
                    if (formSection && formSection.classList.contains('collapsed')) {
                        formSection.classList.remove('collapsed');
                    }
                    
                    // Add error message
                    if (formGroup && !formGroup.querySelector('.field-error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'field-error-message';
                        errorMsg.innerHTML = `<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> ${validation.message}`;
                        formGroup.appendChild(errorMsg);
                    }
                    
                    // Highlight section
                    if (formSection) {
                        formSection.classList.add('error');
                    }
                    
                    // Scroll to field
                    setTimeout(() => {
                        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        field.focus();
                    }, 100);
                }
            }, 250);
            
            // Show error toast
            const tabName = validation.tab.charAt(0).toUpperCase() + validation.tab.slice(1);
            showToast(`<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Required field missing in ${tabName} tab!`, 'error');
            return; // Stop here - don't save
        }
    }
    
    // ========== FIX: Handle editing shared meeting preview ==========
    if (editingSharedMeetingId) {
        const sharedMeeting = state.sharedMeetings.find(sm => sm.id === editingSharedMeetingId);
        
        if (sharedMeeting) {
            // Update the shared meeting data with edited values
            const tagsInput = document.getElementById('meetingTags').value.trim();
            const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
            
            sharedMeeting.meetingData = {
                ...sharedMeeting.meetingData,
                title: document.getElementById('meetingTitle').value.trim(),
                date: document.getElementById('meetingDate').value,
                type: document.getElementById('meetingType').value,
                customTypeIcon: document.getElementById('meetingForm').getAttribute('data-custom-type-icon'),
                duration: document.getElementById('meetingDuration').value,
                notesHTML: getEditorHTML('meetingNotesEditor'),
                notes: getEditorText('meetingNotesEditor'),
                nextStepsHTML: getEditorHTML('meetingNextStepsEditor'),
                nextSteps: getEditorText('meetingNextStepsEditor'),

                participants: [...state.meetingParticipants],
                tags: tags,
                meddpicc: {
                    metrics: document.getElementById('meddpiccMetrics').value.trim(),
                    economicBuyer: document.getElementById('meddpiccEconomicBuyer').value.trim(),
                    decisionCriteria: document.getElementById('meddpiccDecisionCriteria').value.trim(),
                    decisionProcess: document.getElementById('meddpiccDecisionProcess').value.trim(),
                    paperProcess: document.getElementById('meddpiccPaperProcess').value.trim(),
                    pain: document.getElementById('meddpiccPain').value.trim(),
                    champion: document.getElementById('meddpiccChampion').value.trim(),
                    competition: document.getElementById('meddpiccCompetition').value.trim()
                }
            };
            
            // Store edited tasks
            if (state.meetingTasks.length > 0) {
                sharedMeeting.meetingData.associatedTasks = state.meetingTasks.map(title => ({
                    title: title,
                    description: `From shared meeting: ${sharedMeeting.meetingData.title}`,
                    priority: 'medium',
                    status: 'todo',
                    completed: false
                }));
            }
            
            // Save changes
            saveSharingData();
            
            // Show success message
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Changes saved! Now click "Accept & Add" to add to your meetings', 'success');
            
            // Close the form
            closeInlineMeetingForm();
            
            // Return to shared meetings view
            showSharedMeetings();
            
            // Don't continue with normal meeting save
            return;
        }
    }
    // ========== END OF FIX ==========
    
    // All validation passed, proceed with save
    const rawTitle = document.getElementById('meetingTitle').value.trim();
const title = `Meeting · ${rawTitle}`;
const date = document.getElementById('meetingDate').value;
const type = document.getElementById('meetingType').value;

    const notesHTML = getEditorHTML('meetingNotesEditor');
    const notesText = getEditorText('meetingNotesEditor');
    const nextStepsHTML = getEditorHTML('meetingNextStepsEditor');
    const nextStepsText = getEditorText('meetingNextStepsEditor');
    
    // Handle customer - find existing or create new
    let customerId = state.selectedCustomerId;
    let customerName = customerInput;
    
    if (!customerId) {
        // Try to find existing customer by name
        const existingCustomer = state.customers.find(c => 
            c.name.toLowerCase() === customerInput.toLowerCase()
        );
        
        if (existingCustomer) {
            // Use existing customer
            customerId = existingCustomer.id;
            customerName = existingCustomer.name;
        } else {
            // Create new customer
            const newCustomer = {
                id: Date.now().toString(),
                name: customerInput,
                email: '',
                phone: '',
                website: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                industry: '',
                size: '',
                linkedIn: '',
                mapsLink: '',
                createdAt: new Date().toISOString()
            };
            state.customers.push(newCustomer);
            customerId = newCustomer.id;
            customerName = newCustomer.name;
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Customer created!', 'success');
        }
    }
    
    const tagsInput = document.getElementById('meetingTags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    // Get custom type icon if it exists
    const customTypeIcon = document.getElementById('meetingForm').getAttribute('data-custom-type-icon');
    
    // Determine if this is a past meeting
    let finalIsPastMeeting;

    if (state.editingMeeting) {
        // Editing existing meeting - keep its type unless marked completed
        finalIsPastMeeting = state.editingMeeting.isPastMeeting ?? true;
    } else {
        // Creating new meeting - use the flag that was set when form opened
        // IMPORTANT: Use explicit boolean check since false is a valid value
        finalIsPastMeeting = (state.meetingIsPastMeeting === false) ? false : true;
    }

    // If user checked "Mark as completed", always convert to past meeting
    const markCompletedCheckbox = document.getElementById('meetingMarkCompleted');
    if (markCompletedCheckbox && markCompletedCheckbox.checked) {
        finalIsPastMeeting = true;
    }

    console.log('Creating meeting with isPastMeeting:', finalIsPastMeeting); // DEBUG

   const meeting = {
    id: state.editingMeeting?.id || document.getElementById('meetingId').value || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customerId: customerId,
    customerName: customerName,
    date: date,
    type: type,
    customTypeIcon: customTypeIcon || null,
    duration: document.getElementById('meetingDuration').value,
    conferenceLink: document.getElementById('meetingConferenceLink').value.trim(),
    title: title,
    tags: tags,
    participants: state.meetingParticipants,
    notes: notesText,
    notesHTML: notesHTML,
    nextSteps: nextStepsText,
    nextStepsHTML: nextStepsHTML,
    isPastMeeting: finalIsPastMeeting,
    tabId: state.editingMeeting?.tabId || (state.editingMeetingOriginalTab && state.editingMeetingOriginalTab !== 'all' ? state.editingMeetingOriginalTab : 'individual'),
    activityNote: state.editingMeeting?.activityNote || '',
    meddpicc: {
            metrics: document.getElementById('meddpiccMetrics').value.trim(),
            economicBuyer: document.getElementById('meddpiccEconomicBuyer').value.trim(),
            decisionCriteria: document.getElementById('meddpiccDecisionCriteria').value.trim(),
            decisionProcess: document.getElementById('meddpiccDecisionProcess').value.trim(),
            paperProcess: document.getElementById('meddpiccPaperProcess').value.trim(),
            pain: document.getElementById('meddpiccPain').value.trim(),
            champion: document.getElementById('meddpiccChampion').value.trim(),
            competition: document.getElementById('meddpiccCompetition').value.trim()
        },
        createdAt: state.editingMeeting?.createdAt || new Date().toISOString()
    };

    // Sync participants to customer's contact list
    if (customerId && state.meetingParticipants.length > 0) {
        const customer = state.customers.find(c => c.id === customerId);
        if (customer) {
            // Initialize participants array if it doesn't exist
            if (!customer.participants) {
                customer.participants = [];
            }
            
            // Add each meeting participant to customer's contact list (avoid duplicates)
            state.meetingParticipants.forEach(participant => {
                const key = participant.email && participant.email.trim() 
                    ? participant.email.toLowerCase().trim() 
                    : participant.name.toLowerCase().trim();
                
                const alreadyExists = customer.participants.some(p => {
                    const pKey = p.email && p.email.trim() 
                        ? p.email.toLowerCase().trim() 
                        : p.name.toLowerCase().trim();
                    return pKey === key;
                });
                
                if (!alreadyExists) {
                    customer.participants.push({
                        name: participant.name,
                        role: participant.role || '',
                        email: participant.email || '',
                        phone: participant.phone || ''
                    });
                }
            });
        }
    }
    
    if (state.editingMeeting) {
        const index = state.meetings.findIndex(m => m.id === meeting.id);
        state.meetings[index] = meeting;
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Meeting updated!', 'success');
    } else {
        state.meetings.unshift(meeting);
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Meeting saved!', 'success');
    }
    
    // Create tasks from meeting tasks list
    state.meetingTasks.forEach(taskTitle => {
        const existingTask = state.tasks.find(t => t.meetingId === meeting.id && t.title === taskTitle);
        if (!existingTask) {
            const task = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: taskTitle,
                description: `From: ${meeting.title}`,
                priority: 'medium',
                status: 'todo',
                dueDate: '',
                tags: ['meeting'],
                color: 'none',
                subtasks: [],
                completed: false,
                archived: false,
                customerId: customerId,
                customerName: customerName,
                meetingId: meeting.id,
                createdAt: new Date().toISOString()
            };
            state.tasks.unshift(task);
        }
    });
    
    saveData();

    // Auto-switch to "All" if the new meeting is beyond current period
    if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
        const meetingDate = new Date(meeting.date);
        const now = new Date();
        const daysUntilMeeting = Math.floor((meetingDate - now) / (1000 * 60 * 60 * 24));
        
        // If meeting is beyond current period filter, switch to "All"
        if (state.upcomingMeetingsPeriod !== 'all' && daysUntilMeeting > state.upcomingMeetingsPeriod) {
            state.upcomingMeetingsPeriod = 'all';
            document.querySelectorAll('.upcoming-filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.upcoming-filter-btn[data-period="all"]').classList.add('active');
        }
    }
    
    // Store current view state BEFORE any renders
    const wasInDashboard = state.currentCustomer === 'all';
    const wasEditingMeeting = !!state.editingMeeting;
    
    // Clear session storage flag
    sessionStorage.removeItem('takingNotesFor');
    
    // Close the form (this clears editing state)
    document.getElementById('inlineMeetingForm').classList.remove('active');
    document.querySelector('.tasks-section').style.display = 'block';
    document.getElementById('notesContainer').classList.remove('hidden');
    document.getElementById('mainContainer').classList.remove('form-mode');
    document.getElementById('meetingForm').reset();
    document.getElementById('meetingId').value = '';
    state.editingMeeting = null;
    state.meetingTasks = [];
    state.meetingParticipants = [];
    state.selectedCustomerId = null;
    state.editingMeetingOriginalTab = null;
    state.meetingIsPastMeeting = null;
    
    // NOW do the renders
    renderTasks();
    updateStats();
    renderCustomerFilters();
    
    // Refresh upcoming meetings if visible
    if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
        renderUpcomingMeetings();
    }
    

    
// FINALLY, explicitly set the view
if (wasInDashboard && !wasEditingMeeting) {
    // Was creating new meeting from dashboard - STAY in dashboard
    state.currentCustomer = 'all';
    document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
    
    // Force dashboard view
    hideDashboardStats();
    hideCustomerMeetingsSection();
    hideCustomerCustomerInfosSection();
    hideCustomerParticipantsSection();
    showUpcomingMeetings();
    showCustomerActivity();
    showAllCustomersSection();
    
    // Show tasks section
    document.querySelector('.tasks-section').style.display = 'block';
    document.getElementById('notesContainer').classList.remove('hidden');
    
    updateSectionTitle();
    renderTasks();
    renderNotes();
    
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Meeting scheduled!', 'success');
} else if (!wasInDashboard && customerId) {
        // Return to customer view
        selectCustomerFromOverview(customerId);
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Meeting scheduled!', 'success');
    } else {
        // Return to dashboard
        showDashboard();
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Meeting saved!', 'success');
    }
}


        function generateCustomerInfoExport() {
    const customerName = document.getElementById('CustomerInfoCustomerInput').value.trim();
    const background = document.getElementById('CustomerInfoBackground').value.trim();
    const discussionPoints = document.getElementById('CustomerInfoDiscussionPoints').value.trim();
    const materials = document.getElementById('CustomerInfoMaterials').value.trim();
    const outcomes = document.getElementById('CustomerInfoOutcomes').value.trim();
    
    let exportText = `CUSTOMER INFO\n${'='.repeat(40)}\n\n`;
    exportText += `Customer: ${customerName}\n`;
    exportText += `Date: ${new Date().toLocaleString()}\n\n`;
    
    if (background) exportText += `BACKGROUND & CONTEXT\n${'-'.repeat(40)}\n${background}\n\n`;
    if (discussionPoints) exportText += `DISCUSSION POINTS\n${'-'.repeat(40)}\n${discussionPoints}\n\n`;
    if (materials) exportText += `COMPETITIVE INTELLIGENCE\n${'-'.repeat(40)}\n${materials}\n\n`;
    if (outcomes) exportText += `EXPECTED OUTCOMES\n${'-'.repeat(40)}\n${outcomes}\n\n`;
    
    return exportText;
}

        function updateCustomerInfoExportPreview() {
            const preview = document.getElementById('CustomerInfoExportPreview');
            preview.textContent = generateCustomerInfoExport();
        }

        function copyCustomerInfoToClipboard() {
            const exportText = generateCustomerInfoExport();
            navigator.clipboard.writeText(exportText).then(() => {
                showToast('Copied!', 'success');
            }).catch(() => {
                showToast('Failed', 'error');
            });
        }

        function downloadCustomerInfo() {
            const exportText = generateCustomerInfoExport();
            const customerName = document.getElementById('CustomerInfoCustomerInput').value.trim();
            const filename = `prep_${customerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Downloaded!', 'success');
        }

        function exportCustomerInfoFromList(CustomerInfoId) {
            const CustomerInfo = state.CustomerInfos.find(p => p.id === CustomerInfoId);
            if (!CustomerInfo) return;
            let exportText = `CUSTOMERINFO\n${'='.repeat(40)}\n\n`;
            exportText += `Customer: ${CustomerInfo.customerName}\n`;
            exportText += `Date: ${new Date(CustomerInfo.createdAt).toLocaleString()}\n\n`;
            if (CustomerInfo.background) exportText += `BACKGROUND\n${'-'.repeat(40)}\n${CustomerInfo.background}\n\n`;
            if (CustomerInfo.discussionPoints) exportText += `DISCUSSION\n${'-'.repeat(40)}\n${CustomerInfo.discussionPoints}\n\n`;
            if (CustomerInfo.background) exportText += `BACKGROUND\n${'-'.repeat(40)}\n${CustomerInfo.background}\n\n`;
            if (CustomerInfo.materials) exportText += `MATERIALS\n${'-'.repeat(40)}\n${CustomerInfo.materials}\n\n`;
            if (CustomerInfo.outcomes) exportText += `OUTCOMES\n${'-'.repeat(40)}\n${CustomerInfo.outcomes}\n\n`;
            const filename = `prep_${CustomerInfo.customerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            openExportModal('<span class="icon icon-upload"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></span> Export', exportText, filename);
        }

function addParticipant() {
    const nameInput = document.getElementById('participantNameInput');
    const roleInput = document.getElementById('participantRoleInput');
    const emailInput = document.getElementById('participantEmailInput');
    const phoneInput = document.getElementById('participantPhoneInput');
    
    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    
    // Split by comma and clean up - support multiple emails
    const emailsRaw = emailInput.value
        .split(',')
        .map(e => e.trim())
        .filter(e => e); // Remove empty strings
    
    const phonesRaw = phoneInput.value
        .split(',')
        .map(p => p.trim())
        .filter(p => p);
    
    // Store as single string (first email) for backward compatibility, but keep all
    const email = emailsRaw.length > 0 ? emailsRaw[0] : '';
    const phone = phonesRaw.length > 0 ? phonesRaw[0] : '';
    
    if (!name) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter participant name', 'error');
        return;
    }
    
    if (!Array.isArray(state.meetingParticipants)) {
        state.meetingParticipants = [];
    }
    
    // Check for duplicates using first email or name
    const key = email ? email.toLowerCase() : name.toLowerCase();
    const alreadyExists = state.meetingParticipants.some(p => {
        const pKey = p.email && p.email.trim() ? p.email.toLowerCase() : p.name.toLowerCase();
        return pKey === key;
    });
    
    if (alreadyExists && state.editingParticipantIndex === null) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Participant already added', 'error');
        return;
    }
    
    const participant = { 
        name, 
        role, 
        email: email,           // Primary email (for backward compatibility)
        emails: emailsRaw,      // All emails as array
        phone: phone,           // Primary phone (for backward compatibility)
        phones: phonesRaw       // All phones as array
    };
    
    if (state.editingParticipantIndex !== null) {
        state.meetingParticipants[state.editingParticipantIndex] = participant;
        state.editingParticipantIndex = null;
        document.getElementById('addParticipantBtn').innerHTML = '+ Add Participant';
    } else {
        state.meetingParticipants.push(participant);
    }
    
    // Clear form
    nameInput.value = '';
    roleInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    
    renderParticipantsList();
    
    if (state.selectedCustomerId) {
        loadCustomerContacts(state.selectedCustomerId);
    }
    
    const emailCount = emailsRaw.length;
    const phoneCount = phonesRaw.length;
    let message = `<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> ${name} added!`;
    if (emailCount > 1 || phoneCount > 1) {
        message += ` (${emailCount} email${emailCount !== 1 ? 's' : ''}, ${phoneCount} phone${phoneCount !== 1 ? 's' : ''})`;
    }
    showToast(message, 'success');
}

function editParticipant(index) {
    const participant = state.meetingParticipants[index];
    if (!participant) return;
    
    document.getElementById('participantNameInput').value = participant.name;
    document.getElementById('participantRoleInput').value = participant.role || '';
    document.getElementById('participantEmailInput').value = participant.email || '';
    document.getElementById('participantPhoneInput').value = participant.phone || '';
    
    state.editingParticipantIndex = index;
    document.getElementById('addParticipantBtn').innerHTML = '<span class="icon icon-save"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></span> Update Participant';
    
    // Scroll to the input area
    document.getElementById('participantNameInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('participantNameInput').focus();
}

     function renderParticipantsList() {
    const container = document.getElementById('participantsList');
    
    if (!container) {
        console.error('Participants list container not found');
        return;
    }
    
    if (!state.meetingParticipants || !Array.isArray(state.meetingParticipants)) {
        console.warn('meetingParticipants is not an array, initializing');
        state.meetingParticipants = [];
    }
    
    if (state.meetingParticipants.length === 0) {
        container.innerHTML = '<div style="padding: 0.75rem; text-align: center; color: var(--text-secondary); font-size: 0.75rem;">No participants added</div>';
        
        if (state.selectedCustomerId) {
            loadCustomerContacts(state.selectedCustomerId);
        }
        return;
    }

    container.innerHTML = state.meetingParticipants.map((participant, index) => {
        const initials = participant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        
        // Handle both array and single value for emails
        const emails = participant.emails && participant.emails.length > 0 
            ? participant.emails 
            : (participant.email ? [participant.email] : []);
        
        // Handle both array and single value for phones
        const phones = participant.phones && participant.phones.length > 0 
            ? participant.phones 
            : (participant.phone ? [participant.phone] : []);
        
        // Format emails display
        let emailDisplay = '';
        if (emails.length === 1) {
            emailDisplay = `<span><span class="icon icon-mail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span> ${escapeHtml(emails[0])}</span>`;
        } else if (emails.length > 1) {
            emailDisplay = `<span title="${escapeHtml(emails.join(', '))}"><span class="icon icon-mail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span> ${escapeHtml(emails[0])} <small style="opacity: 0.7;">+${emails.length - 1} more</small></span>`;
        }
        
        // Format phones display
        let phoneDisplay = '';
        if (phones.length === 1) {
            phoneDisplay = `<span><span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span> ${escapeHtml(phones[0])}</span>`;
        } else if (phones.length > 1) {
            phoneDisplay = `<span title="${escapeHtml(phones.join(', '))}"><span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span> ${escapeHtml(phones[0])} <small style="opacity: 0.7;">+${phones.length - 1} more</small></span>`;
        }
        
        return `
            <div class="participant-card">
                <div class="participant-avatar">${initials}</div>
                <div class="participant-details">
                    <div class="participant-card-name">${escapeHtml(participant.name)}</div>
                    <div class="participant-card-meta">
                        ${participant.role ? `<span><span class="icon icon-briefcase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span> ${escapeHtml(participant.role)}</span>` : ''}
                        ${emailDisplay}
                        ${phoneDisplay}
                    </div>
                </div>
                <div class="task-actions">
                    <button type="button" class="task-btn" onclick="editParticipant(${index})" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button type="button" class="task-btn delete" onclick="removeParticipant(${index})" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    if (state.selectedCustomerId) {
        loadCustomerContacts(state.selectedCustomerId);
    }
}


        function addQuickTask() {
            const input = document.getElementById('quickTaskInput');
            const taskTitle = input.value.trim();
            if (!taskTitle) {
                showToast('Enter task', 'error');
                return;
            }
            state.meetingTasks.push(taskTitle);
            input.value = '';
            renderMeetingTasksList();
        }

        function removeMeetingTask(index) {
            state.meetingTasks.splice(index, 1);
            renderMeetingTasksList();
        }

        function renderMeetingTasksList() {
            const container = document.getElementById('meetingTasksList');
            if (state.meetingTasks.length === 0) {
                container.innerHTML = '<div style="padding: 0.75rem; text-align: center; color: var(--text-secondary); font-size: 0.75rem;">No tasks</div>';
                return;
            }
            container.innerHTML = state.meetingTasks.map((task, index) => `
                <div class="meeting-task-preview">
                    <span><span class="icon icon-check-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> ${escapeHtml(task)}</span>
                    <button type="button" class="btn-remove-meeting-task" onclick="removeMeetingTask(${index})">×</button>
                </div>
            `).join('');
        }

        
        function generateMeetingExport() {
            const customerName = document.getElementById('meetingCustomerInput').value.trim();
            const title = document.getElementById('meetingTitle').value.trim();
            const date = document.getElementById('meetingDate').value;
            const type = document.getElementById('meetingType').value;
            const duration = document.getElementById('meetingDuration').value;
            const notesHTML = getEditorHTML('meetingNotesEditor');
            const notes = htmlToPlainText(notesHTML);
            const nextStepsHTML = getEditorHTML('meetingNextStepsEditor');
            const nextSteps = htmlToPlainText(nextStepsHTML);
            const metrics = document.getElementById('meddpiccMetrics').value.trim();
            const economicBuyer = document.getElementById('meddpiccEconomicBuyer').value.trim();
            const decisionCriteria = document.getElementById('meddpiccDecisionCriteria').value.trim();
            const decisionProcess = document.getElementById('meddpiccDecisionProcess').value.trim();
            const paperProcess = document.getElementById('meddpiccPaperProcess').value.trim();
            const pain = document.getElementById('meddpiccPain').value.trim();
            const champion = document.getElementById('meddpiccChampion').value.trim();
            const competition = document.getElementById('meddpiccCompetition').value.trim();
            
            let exportText = `MEETING\n${'='.repeat(40)}\n\n`;
            exportText += `Customer: ${customerName}\n`;
            exportText += `Title: ${title}\n`;
            exportText += `Date: ${new Date(date).toLocaleString()}\n`;
            exportText += `Type: ${type}\n`;
            if (duration) exportText += `Duration: ${duration}min\n`;
            exportText += `\n`;
            
if (state.meetingParticipants.length > 0) {
    exportText += `PARTICIPANTS\n${'-'.repeat(40)}\n`;
    state.meetingParticipants.forEach(p => {
        exportText += `• ${p.name}`;
        if (p.role) exportText += `\n  Role: ${p.role}`;
        if (p.email) exportText += `\n  Email: ${p.email}`;
        if (p.phone) exportText += `\n  Phone: ${p.phone}`;
        exportText += `\n`;
    });
    exportText += `\n`;
}
            
            exportText += `NOTES\n${'-'.repeat(40)}\n${notes}\n\n`;
            
            if (nextSteps) {
                exportText += `NEXT STEPS\n${'-'.repeat(40)}\n${nextSteps}\n\n`;
            }
            
            const hasMeddpicc = metrics || economicBuyer || decisionCriteria || decisionProcess || paperProcess || pain || champion || competition;
            if (hasMeddpicc) {
                exportText += `MEDDPICC\n${'='.repeat(40)}\n\n`;
                if (metrics) exportText += `<span class="icon icon-dollar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span> METRICS\n${metrics}\n\n`;
                if (economicBuyer) exportText += `<span class="icon icon-briefcase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span> BUYER\n${economicBuyer}\n\n`;
                if (decisionCriteria) exportText += `<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> CRITERIA\n${decisionCriteria}\n\n`;
                if (decisionProcess) exportText += `<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> PROCESS\n${decisionProcess}\n\n`;
                if (paperProcess) exportText += `<span class="icon icon-file-text"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span> PAPER\n${paperProcess}\n\n`;
                if (pain) exportText += `<span class="icon icon-frown"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></span> PAIN\n${pain}\n\n`;
                if (champion) exportText += `<span class="icon icon-handshake"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg></span> CHAMPION\n${champion}\n\n`;
                if (competition) exportText += `<span class="icon icon-swords"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M14.5 6.5L20 12"/><path d="M18 3h3v3"/><path d="M3 21l9-9"/></svg></span> COMPETITION\n${competition}\n\n`;
            }
            
            if (state.meetingTasks.length > 0) {
                exportText += `ACTIONS\n${'-'.repeat(40)}\n`;
                state.meetingTasks.forEach((task, i) => {
                    exportText += `${i + 1}. ${task}\n`;
                });
                exportText += `\n`;
            }
            
            return exportText;
        }

        function updateMeetingExportPreview() {
            const preview = document.getElementById('meetingExportPreview');
            preview.textContent = generateMeetingExport();
        }

        function copyMeetingToClipboard() {
            const exportText = generateMeetingExport();
            navigator.clipboard.writeText(exportText).then(() => {
                showToast('Copied!', 'success');
            }).catch(() => {
                showToast('Failed', 'error');
            });
        }

        function downloadMeeting() {
            const exportText = generateMeetingExport();
            const customerName = document.getElementById('meetingCustomerInput').value.trim();
            const title = document.getElementById('meetingTitle').value.trim();
            const filename = `meeting_${customerName.replace(/\s+/g, '_')}_${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Downloaded!', 'success');
        }

        function exportMeetingFromList(meetingId) {
            const meeting = state.meetings.find(m => m.id === meetingId);
            if (!meeting) return;
            const notesText = meeting.notesHTML ? htmlToPlainText(meeting.notesHTML) : meeting.notes;
            const nextStepsText = meeting.nextStepsHTML ? htmlToPlainText(meeting.nextStepsHTML) : meeting.nextSteps;
            
            let exportText = `MEETING\n${'='.repeat(40)}\n\n`;
            exportText += `Customer: ${meeting.customerName || 'N/A'}\n`;
            exportText += `Title: ${meeting.title}\n`;
            exportText += `Date: ${new Date(meeting.date).toLocaleString()}\n`;
            exportText += `Type: ${meeting.type}\n`;
            if (meeting.duration) exportText += `Duration: ${meeting.duration}min\n`;
            exportText += `\n`;
            
if (meeting.participants && meeting.participants.length > 0) {
    exportText += `PARTICIPANTS\n${'-'.repeat(40)}\n`;
    meeting.participants.forEach(p => {
        exportText += `• ${p.name}`;
        if (p.role) exportText += `\n  Role: ${p.role}`;
        if (p.email) exportText += `\n  Email: ${p.email}`;
        if (p.phone) exportText += `\n  Phone: ${p.phone}`;
        exportText += `\n`;
    });
    exportText += `\n`;
}
            
            exportText += `NOTES\n${'-'.repeat(40)}\n${notesText}\n\n`;
            
            if (nextStepsText) {
                exportText += `NEXT STEPS\n${'-'.repeat(40)}\n${nextStepsText}\n\n`;
            }
            
            if (meeting.meddpicc) {
                const m = meeting.meddpicc;
                const hasMeddpicc = m.metrics || m.economicBuyer || m.decisionCriteria || m.decisionProcess || m.paperProcess || m.pain || m.champion || m.competition;
                if (hasMeddpicc) {
                    exportText += `MEDDPICC\n${'='.repeat(40)}\n\n`;
                    if (m.metrics) exportText += `<span class="icon icon-dollar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span> METRICS\n${m.metrics}\n\n`;
                    if (m.economicBuyer) exportText += `<span class="icon icon-briefcase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span> BUYER\n${m.economicBuyer}\n\n`;
                    if (m.decisionCriteria) exportText += `<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> CRITERIA\n${m.decisionCriteria}\n\n`;
                    if (m.decisionProcess) exportText += `<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> PROCESS\n${m.decisionProcess}\n\n`;
                    if (m.paperProcess) exportText += `<span class="icon icon-file-text"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span> PAPER\n${m.paperProcess}\n\n`;
                    if (m.pain) exportText += `<span class="icon icon-frown"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></span> PAIN\n${m.pain}\n\n`;
                    if (m.champion) exportText += `<span class="icon icon-handshake"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg></span> CHAMPION\n${m.champion}\n\n`;
                    if (m.competition) exportText += `<span class="icon icon-swords"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M14.5 6.5L20 12"/><path d="M18 3h3v3"/><path d="M3 21l9-9"/></svg></span> COMPETITION\n${m.competition}\n\n`;
                }
            }
            
            const meetingTasks = state.tasks.filter(t => t.meetingId === meeting.id);
            if (meetingTasks.length > 0) {
                exportText += `ACTIONS\n${'-'.repeat(40)}\n`;
                meetingTasks.forEach((task, i) => {
                    exportText += `${i + 1}. ${task.title}\n`;
                });
                exportText += `\n`;
            }
            
            const filename = `meeting_${meeting.customerName.replace(/\s+/g, '_')}_${meeting.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            openExportModal('<span class="icon icon-upload"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></span> Export', exportText, filename);
        }

        function openAllMeetingsModal() {
            renderAllMeetings();
            document.getElementById('allMeetingsModal').classList.add('active');
        }

        function closeAllMeetingsModal() {
            document.getElementById('allMeetingsModal').classList.remove('active');
        }

        function renderAllMeetings() {
            const container = document.getElementById('allMeetingsList');
            const empty = document.getElementById('meetingsEmpty');
            if (state.meetings.length === 0) {
                container.innerHTML = '';
                empty.style.display = 'block';
                return;
            }
            empty.style.display = 'none';
            container.innerHTML = state.meetings.map(meeting => {
                const meetingTasks = state.tasks.filter(t => t.meetingId === meeting.id);
                const meetingDate = new Date(meeting.date);
                const meddpiccScore = calculateMEDDPICCCompletion(meeting);
                const notesText = meeting.notesHTML ? htmlToPlainText(meeting.notesHTML) : meeting.notes;
                return `
                    <div class="meeting-card">
                        <div class="meeting-header">
                            <div class="meeting-info">
                                <h3>${escapeHtml(meeting.title)}</h3>
                                <div class="meeting-date">
                                    <span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> ${meetingDate.toLocaleDateString()}
                                    ${meeting.customerName ? ` • <span class="icon icon-building"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="8" y2="6"/><line x1="12" y1="6" x2="12" y2="6"/><line x1="16" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg></span> ${escapeHtml(meeting.customerName)}` : ''}
                                    ${meeting.type ? ` • <span class="icon icon-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></span> ${escapeHtml(meeting.type)}` : ''}
                                </div>
                            </div>
                            <div class="task-actions">
    <button class="task-btn" onclick="editMeeting('${meeting.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    </button>
    <button class="task-btn" onclick="exportMeetingFromList('${meeting.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    </button>
    <button class="task-btn delete" onclick="deleteMeeting('${meeting.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    </button>
</div>
                        </div>
                        ${meddpiccScore.completed > 0 ? `
                            <div class="meddpicc-section">
                                <div class="meddpicc-section-title"><span class="icon icon-target"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span> MEDDPICC (${meddpiccScore.completed}/8)</div>
                            </div>
                        ` : ''}
                        ${meeting.tags && meeting.tags.length > 0 ? `
                            <div style="margin-bottom: 0.5rem;">
                                ${meeting.tags.map(tag => `<span class="meeting-tag">${escapeHtml(tag)}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="meeting-notes">${escapeHtml(notesText)}</div>
                        ${meetingTasks.length > 0 ? `
                            <div class="meeting-tasks">
                                <div class="meeting-tasks-title"><span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> Actions (${meetingTasks.length})</div>
                                ${meetingTasks.map(task => `
                                    <div class="meeting-task-item">${task.completed ? '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>' : '<span class="icon icon-square"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></span>'} ${escapeHtml(task.title)}</div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
        }

        function editMeeting(meetingId) {
            const meeting = state.meetings.find(m => m.id === meetingId);
            if (meeting) {
                openInlineMeetingForm(meeting);
                closeAllMeetingsModal();
            }
        }

        function deleteMeeting(meetingId) {
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete?', 'Delete meeting?', () => {
        state.meetings = state.meetings.filter(m => m.id !== meetingId);
        state.tasks.forEach(task => {
            if (task.meetingId === meetingId) {
                delete task.meetingId;
            }
        });
        saveData();
        renderAllMeetings();
        renderTasks();
        updateStats();
        if (state.currentCustomer !== 'all') {
            showCustomerMeetingsSection(state.currentCustomer);
        }
        
        // ADD THIS: Refresh upcoming meetings if visible
        if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
            renderUpcomingMeetings();
        }
        
        showToast('Deleted', 'success');
    });
}

       function openTaskModal(task = null) {
    state.editingTask = task;
    state.selectedColor = 'none';
    state.selectedTaskCustomerId = null;
    
    if (task) {
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskCustomerInput').value = task.customerName || '';
        state.selectedTaskCustomerId = task.customerId || null;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status || 'todo';
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskTags').value = task.tags.join(', ');
        document.getElementById('taskColor').value = task.color || 'none';
        document.getElementById('taskMeetingId').value = task.meetingId || '';
        state.selectedColor = task.color || 'none';
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
        const colorOption = document.querySelector(`.color-option[data-color="${state.selectedColor}"]`);
        if (colorOption) colorOption.classList.add('selected');
        const subtasksForm = document.getElementById('subtasksForm');
        subtasksForm.innerHTML = '';
        task.subtasks.forEach(sub => {
            addSubtaskInput(sub.text, sub.completed);
        });
    } else {
        // Creating NEW task - reset everything first
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
        document.getElementById('taskCustomerInput').value = '';
        document.getElementById('taskColor').value = 'none'; 
        document.getElementById('subtasksForm').innerHTML = '';
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
        document.querySelector('.color-option[data-color="none"]').classList.add('selected');
        
        // Reset the selected customer ID
        state.selectedTaskCustomerId = null;
        
        // DEBUG: Log current customer state
        console.log('Opening task modal - state.currentCustomer:', state.currentCustomer);
        
       // ONLY auto-fill customer if viewing a SPECIFIC customer (not dashboard)
if (state.currentCustomer && state.currentCustomer !== 'all') {
    
 // Block task creation for frozen customers
    if (isCustomerFrozen(state.currentCustomer)) {
        showToast('<span class="icon icon-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> Upgrade to add tasks to this customer', 'error');
        openUpgradeModal();
        return;
    }

    const currentCustomerId = state.currentCustomer;
    const customer = state.customers.find(c => c.id === currentCustomerId);

    if (customer) {
        document.getElementById('taskCustomerInput').value = customer.name;
        state.selectedTaskCustomerId = customer.id;
    }
}

        // When on dashboard (state.currentCustomer === 'all'), customer field stays empty
    }
    
    document.getElementById('taskModal').classList.add('active');
}


        function closeTaskModal() {
            document.getElementById('taskModal').classList.remove('active');
            state.editingTask = null;
            state.selectedTaskCustomerId = null;
        }

        function addSubtaskInput(text = '', completed = false) {
            const container = document.getElementById('subtasksForm');
            const div = document.createElement('div');
            div.className = 'subtask-input-group';
            div.innerHTML = `
                <input type="text" class="form-input subtask-input" value="${escapeHtml(text)}" placeholder="Subtask...">
                <button type="button" class="btn-remove-subtask" onclick="this.parentElement.remove()">×</button>
            `;
            container.appendChild(div);
        }

        function handleTaskSubmit(e) {
            e.preventDefault();
            const subtaskInputs = document.querySelectorAll('.subtask-input');
            const subtasks = Array.from(subtaskInputs)
                .map(input => ({ text: input.value.trim(), completed: false }))
                .filter(sub => sub.text);
            const customerInputValue = document.getElementById('taskCustomerInput').value.trim();
            let customerId = state.selectedTaskCustomerId;
            let customerName = customerInputValue;
            if (!customerId && customerInputValue) {
                const existingCustomer = state.customers.find(c => c.name.toLowerCase() === customerInputValue.toLowerCase());
                if (existingCustomer) {
                    customerId = existingCustomer.id;
                    customerName = existingCustomer.name;
                } else {
                    const newCustomer = {
                        id: Date.now().toString(),
                        name: customerInputValue,
                        email: '',
                        phone: '',
                        company: '',
                        notes: '',
                        createdAt: new Date().toISOString()
                    };
                    state.customers.push(newCustomer);
                    customerId = newCustomer.id;
                    customerName = newCustomer.name;
                    showToast('Customer created!', 'success');
                }
            }
            const task = {
    id: document.getElementById('taskId').value || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: document.getElementById('taskTitle').value.trim(),
                description: document.getElementById('taskDescription').value.trim(),
                customerId: customerId || null,
                customerName: customerName || '',
                priority: document.getElementById('taskPriority').value,
                status: document.getElementById('taskStatus').value,
                dueDate: document.getElementById('taskDueDate').value,
                tags: document.getElementById('taskTags').value.split(',').map(t => t.trim()).filter(t => t),
                color: document.getElementById('taskColor').value,
                subtasks: subtasks,
                completed: state.editingTask?.completed || false,
                archived: state.editingTask?.archived || false,
                meetingId: state.editingTask?.meetingId || null,
                createdAt: state.editingTask?.createdAt || new Date().toISOString()
            };
            if (state.editingTask) {
                const index = state.tasks.findIndex(t => t.id === task.id);
                state.tasks[index] = task;
                showToast('Updated!', 'success');
            } else {
                state.tasks.unshift(task);
                showToast('Created!', 'success');
            }
            saveData();
renderTasks();
updateStats();
renderCustomerFilters();
renderTimeline(); 

closeTaskModal();
        }

function openNoteModal(note = null) {
    state.editingNote = note;
    const select = document.getElementById('noteCustomer');
    select.innerHTML = '<option value="">None</option>' + state.customers.map(c => 
        `<option value="${c.id}">${escapeHtml(c.name)}</option>`
    ).join('');
    
    if (note) {
        document.getElementById('noteId').value = note.id;
        document.getElementById('noteContent').value = note.content;
        select.value = note.customerId || '';
    } else {
        document.getElementById('noteForm').reset();
        select.value = (state.currentCustomer !== 'all') ? state.currentCustomer : '';
    }
    document.getElementById('noteModal').classList.add('active');
}

function handleNoteSubmit(e) {
    e.preventDefault();
    const customerId = document.getElementById('noteCustomer').value;
    const customer = state.customers.find(c => c.id === customerId);
    
    const isEditing = !!state.editingNote; // Save this BEFORE closeNoteModal
    
    const note = {
        id: document.getElementById('noteId').value || Date.now().toString(),
        content: document.getElementById('noteContent').value.trim(),
        customerId: customerId || null,
        customerName: customer?.name || '',
        createdAt: state.editingNote?.createdAt || new Date().toISOString()
    };
    
    if (state.editingNote) {
        const index = state.notes.findIndex(n => n.id === note.id);
        state.notes[index] = note;
    } else {
        state.notes.unshift(note);
    }
    saveData();
    renderNotes();
    closeNoteModal();
    showToast(isEditing ? 'Updated!' : 'Created!', 'success'); // Now uses saved value
}

        let currentExportData = null;

        function openExportModal(title, content, filename) {
            currentExportData = { content, filename };
            document.getElementById('exportModalTitle').innerHTML = title;
            document.getElementById('exportModalPreview').textContent = content;
            document.getElementById('exportModal').classList.add('active');
        }

        function closeExportModal() {
            document.getElementById('exportModal').classList.remove('active');
            currentExportData = null;
        }

        function copyFromExportModal() {
            if (currentExportData) {
                navigator.clipboard.writeText(currentExportData.content).then(() => {
                    showToast('Copied!', 'success');
                }).catch(() => {
                    showToast('Failed', 'error');
                });
            }
        }

        function downloadFromExportModal() {
            if (currentExportData) {
                const blob = new Blob([currentExportData.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = currentExportData.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('Downloaded!', 'success');
            }
        }

        function showConfirm(icon, title, message, callback) {
    document.getElementById('confirmIcon').innerHTML = icon;
    document.getElementById('confirmTitle').innerHTML = title;
    document.getElementById('confirmMessage').innerHTML = message;
    state.confirmCallback = callback;
    
    // FIX: Reset cancel button visibility and confirm button styling
    const cancelBtn = document.getElementById('cancelConfirmBtn');
    cancelBtn.style.display = ''; // Reset to default (visible)
    
    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // FIX: Reset confirm button to default danger styling
    newConfirmBtn.textContent = 'Confirm';
    newConfirmBtn.className = 'btn btn-danger';
    
    newConfirmBtn.addEventListener('click', () => {
        if (state.confirmCallback) {
            state.confirmCallback();
        }
        closeConfirmModal();
    });
    
    document.getElementById('confirmModal').classList.add('active');
}

        function closeConfirmModal() {
            document.getElementById('confirmModal').classList.remove('active');
            state.confirmCallback = null;
        }

// Global ESC key handler — closes the topmost active modal
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    // Modal IDs mapped to their close functions, checked in priority order
    // (confirm/export first since they overlay other modals)
    const modals = [
        ['confirmModal', closeConfirmModal],
        ['settingsModal', closeSettingsModal],
        ['exportModal', closeExportModal],
        ['noteEditModal', closeNoteEditModal],
        ['addParticipantModal', closeAddParticipantModal],
        ['participantEditModal', closeParticipantEditModal],
        ['customMeetingTypeModal', closeCustomMeetingTypeModal],
        ['createTabModal', closeCreateTabModal],
        ['phoneCallModal', closePhoneCallModal],
        ['noteModal', closeNoteModal],
        ['taskModal', closeTaskModal],
        ['followUpModal', closeFollowUpModal],
        ['shareModal', closeShareModal],
        ['acceptMeetingModal', closeAcceptMeetingModal],
        ['tagsOverviewModal', closeTagsOverviewModal],
        ['customerFormModal', closeCustomerFormModal],
        ['customersModal', closeCustomersModal],
        ['allMeetingsModal', closeAllMeetingsModal],
        ['consolidatedNotesModal', closeConsolidatedNotesModal],
        ['upgradeModal', closeUpgradeModal],
        ['authModal', closeAuthModal],
    ];

    for (const [id, closeFn] of modals) {
        const el = document.getElementById(id);
        if (el && el.classList.contains('active')) {
            e.preventDefault();
            closeFn();
            return;
        }
    }

    // Close inline forms (not modals, but use .active class)
    const inlineForms = [
        ['inlineMeetingForm', closeInlineMeetingForm],
        ['inlineCustomerInfoForm', closeInlineCustomerInfoForm],
    ];
    for (const [id, closeFn] of inlineForms) {
        const el = document.getElementById(id);
        if (el && el.classList.contains('active')) {
            e.preventDefault();
            closeFn();
            return;
        }
    }
});

// ── Settings Panel ──
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('active');
    loadSettingsState();
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function loadSettingsState() {
    // Account info
    const user = auth.currentUser;
    const nameEl = document.getElementById('settingsName');
    const emailEl = document.getElementById('settingsEmail');
    const avatarEl = document.getElementById('settingsAvatar');
    const badgeEl = document.getElementById('settingsPlanBadge');
    const slotEl = document.getElementById('settingsSlotCount');

    if (user) {
        nameEl.textContent = user.displayName || 'User';
        emailEl.textContent = user.email || '';
        if (user.photoURL) {
            avatarEl.innerHTML = `<img src="${user.photoURL}" alt="">`;
        } else {
            avatarEl.textContent = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
        }
    } else {
        nameEl.textContent = 'Not signed in';
        emailEl.textContent = '';
        avatarEl.textContent = '?';
    }

    // Plan info
    const plan = state.subscription?.plan || 'starter';
    badgeEl.textContent = plan === 'unlimited' ? 'Unlimited' : plan.charAt(0).toUpperCase() + plan.slice(1);
    const limit = getCustomerLimit();
    const maxCustomers = limit === Infinity ? '∞' : limit;
    slotEl.textContent = `${state.customers.length} / ${maxCustomers}`;

    // AI settings
    const aiSettings = JSON.parse(localStorage.getItem('cnotes_ai_settings') || '{}');
    document.getElementById('settingsAiNotes').checked = aiSettings.notes !== false;
    document.getElementById('settingsAiPrep').checked = aiSettings.prep !== false;
    document.getElementById('settingsAiSummary').checked = aiSettings.summary !== false;

    // AI usage
    const today = new Date().toDateString();
    const aiUsage = JSON.parse(localStorage.getItem('cnotes_ai_usage') || '{}');
    document.getElementById('settingsAiUsage').textContent = aiUsage[today] || 0;

    // Notification settings
    const notifSettings = JSON.parse(localStorage.getItem('cnotes_notif_settings') || '{}');
    document.getElementById('settingsMeetingReminders').checked = !!notifSettings.meetingReminders;
    document.getElementById('settingsReminderTiming').value = notifSettings.reminderMinutes || '15';
    document.getElementById('settingsReminderTimingRow').style.display = notifSettings.meetingReminders ? 'flex' : 'none';
    document.getElementById('settingsTaskAlerts').checked = !!notifSettings.taskAlerts;
    document.getElementById('settingsShareAlerts').checked = !!notifSettings.shareAlerts;
    document.getElementById('settingsSound').checked = notifSettings.sound !== false;

    // Activity thresholds
    const thresholds = getActivityThresholds();
    document.getElementById('settingsWarningDays').value = thresholds.warningDays;
    document.getElementById('settingsOverdueDays').value = thresholds.overdueDays;
    document.getElementById('settingsColorMeetings').checked = thresholds.colorMeetings;
    document.getElementById('settingsColorCalls').checked = thresholds.colorCalls;
}

function updateSettingsAi() {
    const settings = {
        notes: document.getElementById('settingsAiNotes').checked,
        prep: document.getElementById('settingsAiPrep').checked,
        summary: document.getElementById('settingsAiSummary').checked,
    };
    localStorage.setItem('cnotes_ai_settings', JSON.stringify(settings));
    saveSettingsToFirestore();

    // Hide/show AI buttons in the UI
    document.querySelectorAll('.ai-improve-btn, [onclick*="improveWith"]').forEach(el => {
        el.style.display = settings.notes ? '' : 'none';
    });
}

function updateSettingsNotifications() {
    const meetingReminders = document.getElementById('settingsMeetingReminders').checked;
    const settings = {
        meetingReminders: meetingReminders,
        reminderMinutes: parseInt(document.getElementById('settingsReminderTiming').value),
        taskAlerts: document.getElementById('settingsTaskAlerts').checked,
        shareAlerts: document.getElementById('settingsShareAlerts').checked,
        sound: document.getElementById('settingsSound').checked,
    };
    localStorage.setItem('cnotes_notif_settings', JSON.stringify(settings));
    saveSettingsToFirestore();

    // Show/hide reminder timing row
    document.getElementById('settingsReminderTimingRow').style.display = meetingReminders ? 'flex' : 'none';

    // Request notification permission if enabling any notification
    if (meetingReminders || settings.taskAlerts || settings.shareAlerts) {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // Restart meeting reminder timer if enabled
    if (meetingReminders) {
        startMeetingReminderCheck();
    } else {
        stopMeetingReminderCheck();
    }
}

// Meeting reminder check interval
let meetingReminderInterval = null;

function startMeetingReminderCheck() {
    stopMeetingReminderCheck();
    meetingReminderInterval = setInterval(checkMeetingReminders, 60000); // Check every minute
}

function stopMeetingReminderCheck() {
    if (meetingReminderInterval) {
        clearInterval(meetingReminderInterval);
        meetingReminderInterval = null;
    }
}

function checkMeetingReminders() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const notifSettings = JSON.parse(localStorage.getItem('cnotes_notif_settings') || '{}');
    if (!notifSettings.meetingReminders) return;

    const now = new Date();
    const reminderMs = (notifSettings.reminderMinutes || 15) * 60 * 1000;
    const reminded = JSON.parse(sessionStorage.getItem('cnotes_reminded') || '[]');

    state.meetings.forEach(meeting => {
        if (!meeting.date) return;
        const meetingTime = new Date(meeting.date);
        const diff = meetingTime - now;

        // If meeting is within the reminder window and hasn't been reminded yet
        if (diff > 0 && diff <= reminderMs && !reminded.includes(meeting.id)) {
            const mins = Math.round(diff / 60000);
            new Notification('Cnotes - Meeting Reminder', {
                body: `"${meeting.title}" starts in ${mins} minute${mins !== 1 ? 's' : ''}`,
                icon: '/favicon.ico',
            });
            reminded.push(meeting.id);
            sessionStorage.setItem('cnotes_reminded', JSON.stringify(reminded));
        }
    });
}

// Start reminder check on load if enabled
(function() {
    const notifSettings = JSON.parse(localStorage.getItem('cnotes_notif_settings') || '{}');
    if (notifSettings.meetingReminders) {
        startMeetingReminderCheck();
    }
})();

// Activity threshold settings
function getActivityThresholds() {
    const saved = JSON.parse(localStorage.getItem('cnotes_activity_thresholds') || '{}');
    return {
        warningDays: saved.warningDays || 14,
        overdueDays: saved.overdueDays || 30,
        colorMeetings: saved.colorMeetings !== false ? true : false,
        colorCalls: saved.colorCalls !== false ? true : false,
    };
}

function updateActivityThresholds() {
    const warningDays = parseInt(document.getElementById('settingsWarningDays').value) || 14;
    const overdueDays = parseInt(document.getElementById('settingsOverdueDays').value) || 30;

    // Ensure overdue > warning
    if (overdueDays <= warningDays) {
        document.getElementById('settingsOverdueDays').value = warningDays + 1;
    }

    const settings = {
        warningDays: warningDays,
        overdueDays: Math.max(overdueDays, warningDays + 1),
        colorMeetings: document.getElementById('settingsColorMeetings').checked,
        colorCalls: document.getElementById('settingsColorCalls').checked,
    };
    localStorage.setItem('cnotes_activity_thresholds', JSON.stringify(settings));
    saveSettingsToFirestore();

    // Re-render activity if visible
    if (document.getElementById('customerActivitySection')?.classList.contains('active')) {
        renderCustomerActivity();
    }
}

// Mobile sidebar toggle
function toggleMobileSidebar() {
    document.querySelector('.sidebar').classList.toggle('mobile-open');
    document.getElementById('mobileOverlay').classList.toggle('active');
}
function closeMobileSidebar() {
    document.querySelector('.sidebar')?.classList.remove('mobile-open');
    document.getElementById('mobileOverlay')?.classList.remove('active');
}

// Custom context menu actions
function ctxAction(action) {
    const menu = document.getElementById('ctxMenu');
    if (menu) menu.classList.remove('active');

    switch (action) {
        case 'home':
            document.getElementById('homeBtn')?.click();
            break;
        case 'meeting':
            if (state.currentCustomer !== 'all') {
                openInlineMeetingFormForCustomer(state.currentCustomer);
            } else {
                openInlineMeetingForm();
            }
            break;
        case 'customers':
            document.getElementById('addCustomerBtn')?.click();
            break;
        case 'tasks':
            openTaskModal();
            break;
        case 'theme':
            toggleTheme();
            break;
    }
}

// Close follow-up modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('followUpModal');
    if (modal && e.target === modal) {
        closeFollowUpModal();
    }
});

             async function confirmClearAll() {
    // Clear local state
    state.tasks = [];
    state.notes = [];
    state.customers = [];
    state.meetings = [];
    state.CustomerInfos = [];
    state.sharedMeetings = [];
    state.myShares = [];
    state.meetingTabs = [
        { id: 'all', name: 'All Meetings', icon: '', isDefault: true },
        { id: 'individual', name: 'Individual', icon: '', isDefault: true }
    ];
    
    // Clear localStorage
    localStorage.clear();
    
    // If user is signed in, also clear from Firestore
    if (auth.currentUser) {
        try {
            const deletePromises = [];
            
            // Delete shared meetings where user is the sharer (shared BY me)
            const sharedByMe = await db.collection('sharedMeetings')
                .where('sharedBy', '==', auth.currentUser.uid)
                .get();
            
            sharedByMe.docs.forEach(doc => {
                deletePromises.push(doc.ref.delete());
            });
            
            // Delete shared meetings where user is the recipient (shared WITH me)
            const sharedWithMe = await db.collection('sharedMeetings')
                .where('sharedWithEmail', '==', auth.currentUser.email.toLowerCase())
                .get();
            
            sharedWithMe.docs.forEach(doc => {
                deletePromises.push(doc.ref.delete());
            });
            
            // Wait for all deletes to complete
            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
                console.log(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Deleted ${deletePromises.length} shared meeting(s) from Firestore`);
            }
            
            // Save cleared state to Firestore (clears user's main data document)
            await saveUserDataToFirestore();
            
        } catch (error) {
            console.error('Error clearing Firestore data:', error);
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Some cloud data may not have been cleared', 'error');
        }
    }
    
    // Update UI
    render();
    updateStats();
    renderCustomerFilters();
    updateShareNotificationBadge();
    showDashboard();
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> All data cleared!', 'success');
}

        function toggleTaskComplete(id) {
            const task = state.tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                if (task.completed) {
                    task.status = 'done';
                } else if (task.status === 'done') {
                    task.status = 'todo';
                }
                saveData();
                renderTasks();
renderTimeline();
                updateStats();

            }
        }

        function toggleSubtask(taskId, subtaskIndex) {
            const task = state.tasks.find(t => t.id === taskId);
            if (task && task.subtasks[subtaskIndex]) {
                task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
                saveData();
                renderTasks();
            }
        }

        function editTask(id) {
            const task = state.tasks.find(t => t.id === id);
            if (task) openTaskModal(task);
        }

        function deleteTask(id) {
            showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete?', 'Delete task?', () => {
                state.tasks = state.tasks.filter(t => t.id !== id);
                saveData();
                renderTasks();
renderTimeline();
                updateStats();
                renderCustomerFilters();

                showToast('Deleted', 'success');
            });
        }

        function archiveTask(id) {
            const task = state.tasks.find(t => t.id === id);
            if (task) {
                task.archived = !task.archived;
                saveData();
                renderTasks();
renderTimeline();
                renderCustomerFilters();

                showToast(task.archived ? 'Archived' : 'Unarchived', 'success');
            }
        }

        function changeTaskStatus(taskId, newStatus) {
            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                if (newStatus === 'done') {
                    task.completed = true;
                } else {
                    task.completed = false;
                }
                saveData();
                renderTasks();
                updateStats();
            }
        }

function cycleTaskStatus(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Cycle through statuses: todo -> in-progress -> done -> todo
    const statusCycle = {
        'todo': 'in-progress',
        'in-progress': 'done',
        'done': 'todo'
    };
    
    const newStatus = statusCycle[task.status] || 'todo';
    task.status = newStatus;
    
    // Update completed flag to match status
    if (newStatus === 'done') {
        task.completed = true;
    } else {
        task.completed = false;
    }
    
    saveData();
    renderTasks();
    renderTimeline();
    updateStats();
    
    // Show feedback
    const statusLabels = {
        'todo': '<span class="icon icon-edit-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span> To Do',
        'in-progress': '<span class="icon icon-rocket"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></span> In Progress',
        'done': '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Done'
    };
    showToast(`Status: ${statusLabels[newStatus]}`, 'success');
}

        function showArchived() {
            state.currentView = 'archived';
            document.querySelectorAll('.view-btn[data-view="active"], .view-btn[data-view="archived"]').forEach(b => b.classList.remove('active'));
            document.querySelector('.view-btn[data-view="archived"]').classList.add('active');
            renderTasks();
        }

        function editNote(id) {
            const note = state.notes.find(n => n.id === id);
            if (note) openNoteModal(note);
        }

        function deleteNote(id) {
            showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete note ?', '', () => {
                state.notes = state.notes.filter(n => n.id !== id);
                saveData();
                renderNotes();
                showToast('Deleted', 'success');
            });
        }

function render() {
    renderTasks();
    renderNotes();
    renderTimeline();
    

}

// Timeline Functions
function toggleSidebarCollapse() {
    const container = document.getElementById('notesContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    container.classList.toggle('collapsed-right');
    mainContainer.classList.toggle('sidebar-collapsed');
    
    const btn = container.querySelector('.sidebar-collapse-btn');
    if (container.classList.contains('collapsed-right')) {
        btn.textContent = '←';
        btn.title = 'Expand';
    } else {
        btn.textContent = '→';
        btn.title = 'Collapse';
    }
}

function renderTimeline() {
    const section = document.getElementById('timelineSection');
    const container = document.getElementById('timelineList');
    const empty = document.getElementById('timelineEmpty');
    
    // Only show in customer view
    if (state.currentCustomer === 'all') {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    const customerId = state.currentCustomer;
    const customer = state.customers.find(c => c.id === customerId);
    
    // Collect all activities for this customer
    let activities = [];
    
    // Add customer creation
    if (customer && customer.createdAt) {
activities.push({
    type: 'customer',
    id: customer.id,
    icon: getBuildingSVG(14),
            title: 'Customer created',
            date: new Date(customer.createdAt),
            dotClass: 'customer',
            deletable: false // Don't allow deleting customer from timeline
        });
    }
    
   // Add meetings and calls
const customerMeetings = state.meetings.filter(m => m.customerId === customerId);
customerMeetings.forEach(meeting => {
    const meetingDate = new Date(meeting.date);
    const now = new Date();

    if (meeting.type === 'phone-call') {
        const contactNames = meeting.participants && meeting.participants.length > 0
            ? meeting.participants.map(p => p.name).join(', ')
            : '';
        const label = meeting.connected
            ? `Call${contactNames ? ' · ' + contactNames : ''}`
            : `Call${contactNames ? ' · ' + contactNames : ''} — ${meeting.reason || 'No Answer'}`;

        activities.push({
            type: 'call',
            id: meeting.id,
            icon: `<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>/svg>`,
            title: label,
            subtitle: meeting.connected
                ? `${meeting.duration ? meeting.duration + ' min' : ''}`
                : meeting.reason || 'No Answer',
            date: meetingDate,
            dotClass: meeting.connected ? 'meeting' : 'task-pending',
            subtype: meeting.connected ? 'CONNECTED' : (meeting.reason || 'NO ANSWER').toUpperCase(),
            subtypeColor: meeting.connected ? '#127c87' : '#f59e0b',
            deletable: true
        });
    } else {
        const isUpcoming = meetingDate > now && !meeting.isPastMeeting;
        activities.push({
            type: 'meeting',
            id: meeting.id,
            icon: getCalendarSVG(14),
            title: meeting.title,
            date: meetingDate,
            dotClass: isUpcoming ? 'meeting-upcoming' : 'meeting',
            subtype: isUpcoming ? 'Upcoming' : 'Meeting',
            subtypeColor: isUpcoming ? '#f59e0b' : '#3b82f6',
            deletable: true
        });
    }
});

    
    // Add tasks
    const customerTasks = state.tasks.filter(t => t.customerId === customerId);
    customerTasks.forEach(task => {
        activities.push({
            type: 'task',
            id: task.id,
    icon: task.completed ? '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>' : getCheckboxSVG(14),
            title: task.title,
            date: new Date(task.createdAt),
            dotClass: task.completed ? 'task-done' : 'task-pending',
            subtype: task.completed ? 'Completed' : 'Task',
            deletable: true
        });
    });
    
    // Add CustomerInfos
    const customerPreps = state.CustomerInfos.filter(p => p.customerId === customerId);
    customerPreps.forEach(prep => {
        activities.push({
            type: 'prep',
            id: prep.id,
            icon: '<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span>',
            title: 'Customer info added',
            date: new Date(prep.createdAt),
            dotClass: 'prep',
            subtype: 'Prep',
            deletable: true
        });
    });
    
    // Add notes (if they have customer association - for now show all notes in customer view)
    // You can modify this logic based on your needs
    
    // Sort by date (newest first)
    activities.sort((a, b) => b.date - a.date);
    
    if (activities.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    
    empty.style.display = 'none';
    
    // Group by date
    const grouped = groupActivitiesByDate(activities);
    
    let html = '';
    
    grouped.forEach(group => {
        html += `<div class="timeline-date-separator">${group.label}</div>`;
        
        group.items.forEach(activity => {
            const timeStr = activity.date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            const deleteBtn = activity.deletable ? `
                <div class="timeline-item-actions">
                    <button class="timeline-delete-btn" onclick="event.stopPropagation(); deleteTimelineItem('${activity.type}', '${activity.id}')" title="Delete">
                        <svg viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            ` : '';
            
            const subtypeColor = activity.subtypeColor || '';
const dateStr = activity.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

html += `
    <div class="timeline-item" style="position: relative;">
        <div class="timeline-dot ${activity.dotClass}"></div>
        <div class="timeline-item-header">
            <span class="timeline-item-icon">${activity.icon}</span>
            <span class="timeline-item-title">${escapeHtml(activity.title)}</span>
        </div>
        <div class="timeline-item-meta">
            <span>${dateStr} · ${timeStr}</span>
            ${activity.subtype ? `<span class="timeline-item-type" style="${subtypeColor ? 'color:' + subtypeColor + ';' : ''}">${activity.subtype}</span>` : ''}
        </div>
        ${deleteBtn}
    </div>
`;

        });
    });
    
    container.innerHTML = html;
}

function deleteTimelineItem(type, id) {
    let itemName = '';
    let deleteCallback = null;
    
    switch (type) {
        case 'task':
            const task = state.tasks.find(t => t.id === id);
            if (!task) return;
            itemName = `task "${task.title}"`;
            deleteCallback = () => {
                state.tasks = state.tasks.filter(t => t.id !== id);
                saveData();
                renderTasks();
                renderTimeline();
                updateStats();
                renderCustomerFilters();
            };
            break;
            
        case 'meeting':
            const meeting = state.meetings.find(m => m.id === id);
            if (!meeting) return;
            itemName = `meeting "${meeting.title}"`;
            deleteCallback = () => {
                state.meetings = state.meetings.filter(m => m.id !== id);
                // Remove meeting reference from tasks
                state.tasks.forEach(task => {
                    if (task.meetingId === id) {
                        delete task.meetingId;
                    }
                });
                saveData();
                renderTimeline();
                updateStats();
                if (state.currentCustomer !== 'all') {
                    showCustomerMeetingsSection(state.currentCustomer);
                }
                if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
                    renderUpcomingMeetings();
                }
            };
            break;
            
        case 'prep':
            const prep = state.CustomerInfos.find(p => p.id === id);
            if (!prep) return;
            itemName = 'customer info';
            deleteCallback = () => {
                state.CustomerInfos = state.CustomerInfos.filter(p => p.id !== id);
                saveData();
                renderTimeline();
                updateStats();
                if (state.currentCustomer !== 'all') {
                    showCustomerCustomerInfosSection(state.currentCustomer);
                }
            };
            break;
            
        case 'note':
            const note = state.notes.find(n => n.id === id);
            if (!note) return;
            itemName = 'note';
            deleteCallback = () => {
                state.notes = state.notes.filter(n => n.id !== id);
                saveData();
                renderTimeline();
                renderNotes();
            };
            break;
            
        default:
            return;
    }
    
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete?', `Delete this ${itemName}?`, () => {
        deleteCallback();
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Deleted', 'success');
    });
}

function groupActivitiesByDate(activities) {
    const groups = [];
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
    
    let currentGroup = null;
    
    activities.forEach(activity => {
        const activityDateStr = activity.date.toDateString();
        let label;
        
        if (activityDateStr === today) {
            label = 'Today';
        } else if (activityDateStr === yesterday) {
            label = 'Yesterday';
        } else {
            // Check if it's this week
            const daysAgo = Math.floor((now - activity.date) / (1000 * 60 * 60 * 24));
            if (daysAgo < 7) {
                label = activity.date.toLocaleDateString('en-US', { weekday: 'long' });
            } else {
                label = activity.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: activity.date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        }
        
        if (!currentGroup || currentGroup.label !== label) {
            currentGroup = { label, items: [] };
            groups.push(currentGroup);
        }
        
        currentGroup.items.push(activity);
    });
    
    return groups;
}

        function renderTasks() {
            if (state.currentDisplayMode === 'kanban') {
                renderKanban();
            } else {
                renderList();
            }
        }

function renderList() {
    let tasks = state.tasks.filter(t => t.archived === (state.currentView === 'archived'));
    
    // Filter by customer
    if (state.currentCustomer !== 'all') {
        // Only show tasks that have this specific customer assigned
        tasks = tasks.filter(t => t.customerId && t.customerId === state.currentCustomer);
    }
    
    // Filter by search query
    if (state.searchQuery) {
        tasks = tasks.filter(t => {
            const matchesTitle = t.title.toLowerCase().includes(state.searchQuery);
            const matchesDescription = t.description.toLowerCase().includes(state.searchQuery);
            const matchesCustomerName = t.customerName && t.customerName.toLowerCase().includes(state.searchQuery);
            const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(state.searchQuery));
            
            // Search company name
            let matchesCompany = false;
            if (t.customerId) {
                const customer = state.customers.find(c => c.id === t.customerId);
                if (customer && customer.company) {
                    matchesCompany = customer.company.toLowerCase().includes(state.searchQuery);
                }
            }
            
            // Search meeting participant names and roles
            let matchesParticipant = false;
            if (t.meetingId) {
                const meeting = state.meetings.find(m => m.id === t.meetingId);
                if (meeting && meeting.participants) {
                    matchesParticipant = meeting.participants.some(p => 
                        (p.role && p.role.toLowerCase().includes(state.searchQuery)) ||
                        (p.name && p.name.toLowerCase().includes(state.searchQuery))
                    );
                }
            }
            
            return matchesTitle || matchesDescription || matchesCustomerName || 
                   matchesTags || matchesCompany || matchesParticipant;
        });
    }
    
    // Filter by time/priority
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    switch (state.currentFilter) {
        case 'today':
            tasks = tasks.filter(t => t.dueDate === today);
            break;
        case 'week':
            tasks = tasks.filter(t => t.dueDate && t.dueDate <= weekFromNow);
            break;
        case 'overdue':
            tasks = tasks.filter(t => t.dueDate && t.dueDate < today && !t.completed);
            break;
        case 'high':
            tasks = tasks.filter(t => t.priority === 'high');
            break;
    }
    
// Sort by priority: high -> medium -> low
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // If same priority, sort by due date (earliest first)
        if (a.dueDate && b.dueDate) {
            return a.dueDate.localeCompare(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });

    const container = document.getElementById('tasksList');
const empty = document.getElementById('tasksEmpty');
const headerAddButton = document.querySelector('.tasks-section .btn-add-meeting');

if (tasks.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    empty.className = 'empty-state-compact';
    
    // Hide header button when empty
    if (headerAddButton) headerAddButton.style.display = 'none';
    
    if (state.searchQuery) {
        empty.innerHTML = `
            <div class="empty-state-icon"><span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span></div>
            <div>No results for "${escapeHtml(state.searchQuery)}"</div>
        `;
} else {
    empty.innerHTML = `
        <div class="empty-state-icon"></div>
        <div style="margin-bottom: 1rem;">No tasks yet</div>
        <button class="btn-schedule-meeting" onclick="openTaskModal()" style="margin: 0 auto; display: inline-flex;">
            <span>+</span>
            <span>Task</span>
        </button>
    `;
}
    return;
}


// Show header button when there are tasks
if (headerAddButton) headerAddButton.style.display = 'flex';

empty.style.display = 'none';
    empty.style.display = 'none';
    container.innerHTML = tasks.map((task, index) => createTaskCard(task, index + 1)).join('');
    setupDragDrop();
}

function setupSectionResize() {
    ['customerActivitySection', 'allCustomersSection'].forEach(id => {
        const section = document.getElementById(id);
        
        // Load saved height
        const savedHeight = localStorage.getItem(`height_${id}`);
        if (savedHeight) section.style.height = savedHeight;
        
        // Save height on mouseup (after resize)
        section.addEventListener('mouseup', () => {
            localStorage.setItem(`height_${id}`, section.style.height);
        });
    });
}

function renderKanban() {
    let tasks = state.tasks.filter(t => !t.archived);
    
    if (state.currentCustomer !== 'all') {
        // Only show tasks that have this specific customer assigned
        tasks = tasks.filter(t => t.customerId && t.customerId === state.currentCustomer);
    }
    
    // ADD THIS BLOCK for search filtering
    if (state.searchQuery) {
        tasks = tasks.filter(t => {
            const matchesTitle = t.title.toLowerCase().includes(state.searchQuery);
            const matchesDescription = t.description.toLowerCase().includes(state.searchQuery);
            const matchesCustomerName = t.customerName && t.customerName.toLowerCase().includes(state.searchQuery);
            const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(state.searchQuery));
            
            let matchesCompany = false;
            if (t.customerId) {
                const customer = state.customers.find(c => c.id === t.customerId);
                if (customer && customer.company) {
                    matchesCompany = customer.company.toLowerCase().includes(state.searchQuery);
                }
            }
            
            let matchesParticipant = false;
            if (t.meetingId) {
                const meeting = state.meetings.find(m => m.id === t.meetingId);
                if (meeting && meeting.participants) {
                    matchesParticipant = meeting.participants.some(p => 
                        (p.role && p.role.toLowerCase().includes(state.searchQuery)) ||
                        (p.name && p.name.toLowerCase().includes(state.searchQuery))
                    );
                }
            }
            
            return matchesTitle || matchesDescription || matchesCustomerName || 
                   matchesTags || matchesCompany || matchesParticipant;
        });
    }

// Sort by priority: high -> medium -> low
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        if (a.dueDate && b.dueDate) {
            return a.dueDate.localeCompare(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });

            const todoTasks = tasks.filter(t => t.status === 'todo');
            const progressTasks = tasks.filter(t => t.status === 'in-progress');
            const doneTasks = tasks.filter(t => t.status === 'done');
            document.getElementById('todoCount').textContent = todoTasks.length;
            document.getElementById('progressCount').textContent = progressTasks.length;
            document.getElementById('doneCount').textContent = doneTasks.length;
            document.getElementById('todoColumn').innerHTML = todoTasks.map((task, index) => createTaskCard(task, index + 1, true)).join('');
            document.getElementById('progressColumn').innerHTML = progressTasks.map((task, index) => createTaskCard(task, index + 1, true)).join('');
            document.getElementById('doneColumn').innerHTML = doneTasks.map((task, index) => createTaskCard(task, index + 1, true)).join('');
            setupKanbanDragDrop();
        }

        function setupDragDrop() {
            const tasksList = document.getElementById('tasksList');
            let draggedElement = null;
            tasksList.querySelectorAll('.task-card').forEach(card => {
                card.addEventListener('dragstart', (e) => {
                    draggedElement = card;
                    card.classList.add('dragging');
                });
                card.addEventListener('dragend', () => {
                    card.classList.remove('dragging');
                    updateTaskOrder();
                });
            });
            tasksList.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(tasksList, e.clientY);
                const dragging = document.querySelector('.dragging');
                if (afterElement == null) {
                    tasksList.appendChild(dragging);
                } else {
                    tasksList.insertBefore(dragging, afterElement);
                }
            });
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        function updateTaskOrder() {
            const taskElements = document.querySelectorAll('#tasksList .task-card');
            const newOrder = [];
            taskElements.forEach(el => {
                const taskId = el.dataset.taskId;
                const task = state.tasks.find(t => t.id === taskId);
                if (task) newOrder.push(task);
            });
            state.tasks = newOrder.concat(state.tasks.filter(t => !newOrder.includes(t)));
            saveData();
            showToast('Reordered', 'success');
        }

        function setupKanbanDragDrop() {
            const columns = document.querySelectorAll('.kanban-cards');
            columns.forEach(column => {
                column.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    column.classList.add('drag-over');
                });
                column.addEventListener('dragleave', () => {
                    column.classList.remove('drag-over');
                });
                column.addEventListener('drop', (e) => {
                    e.preventDefault();
                    column.classList.remove('drag-over');
                    const taskId = e.dataTransfer.getData('text/plain');
                    const newStatus = column.dataset.status;
                    changeTaskStatus(taskId, newStatus);
                });
            });
            const cards = document.querySelectorAll('.kanban-cards .task-card');
            cards.forEach(card => {
                card.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', card.dataset.taskId);
                    card.classList.add('dragging');
                });
                card.addEventListener('dragend', () => {
                    card.classList.remove('dragging');
                });
            });
        }

        function createTaskCard(task, number, isKanban = false) {
            const today = new Date().toISOString().split('T')[0];
            const threeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            let dueDateClass = '';
            let dueDateText = '';
            if (task.dueDate) {
                if (task.dueDate < today && !task.completed) {
                    dueDateClass = 'overdue';
                    dueDateText = '<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Overdue';
                } else if (task.dueDate <= threeDays && !task.completed) {
                    dueDateClass = 'due-soon';
                    dueDateText = '<span class="icon icon-alarm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3L2 6"/><path d="M22 6l-3-3"/></svg></span> Soon';
                } else {
                    dueDateText = `<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> ${task.dueDate}`;
                }
            }
            // Use manual color if set, otherwise auto-color by priority
let colorClass = '';
if (task.color && task.color !== 'none') {
    colorClass = `color-${task.color}`;
} else {
    colorClass = `priority-${task.priority}-auto`;
}
            return `
                <div class="task-card ${dueDateClass} ${colorClass}" draggable="true" data-task-id="${task.id}">
                    <div class="task-number">${number}</div>
                    <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="event.stopPropagation(); toggleTaskComplete('${task.id}')">
                        <svg viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div class="task-content">
                        <div class="task-header">
                            <div style="flex: 1;">
                               ${task.customerName ? `
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
        ${getCustomerLogo(task.customerId)}
        <span style="font-size: 0.95rem; font-weight: 700; color: #127c87;">${escapeHtml(task.customerName)}</span>
    </div>
` : ''}
                                <div class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</div>
                            </div>
<div class="task-badges">
    ${task.meetingId ? '<span class="task-meeting-badge"><span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span></span>' : ''}
    <span class="task-status status-${task.status}" onclick="event.stopPropagation(); cycleTaskStatus('${task.id}')" title="Click to change status">${task.status === 'todo' ? '<span class="icon icon-edit-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span> To Do' : task.status === 'in-progress' ? '<span class="icon icon-rocket"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></span> In Progress' : '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Completed'}</span>
    <span class="task-priority priority-${task.priority}">${task.priority}</span>
</div>
                        </div>
                        ${task.dueDate ? `<div class="task-due-date ${dueDateClass}">${dueDateText}</div>` : ''}
                        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                        ${task.subtasks.length > 0 ? `
                            <div class="subtasks-container">
                                ${task.subtasks.map((sub, i) => `
                                    <div class="subtask-item">
                                        <div class="subtask-checkbox ${sub.completed ? 'completed' : ''}" onclick="event.stopPropagation(); toggleSubtask('${task.id}', ${i})"></div>
                                        <span class="subtask-text ${sub.completed ? 'completed' : ''}">${escapeHtml(sub.text)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        <div class="task-meta">
                            <div class="task-tags">
                                ${task.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                            </div>
                            <div class="task-actions">
                                <button class="task-btn" onclick="event.stopPropagation(); editTask('${task.id}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="task-btn archive" onclick="event.stopPropagation(); archiveTask('${task.id}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="21 8 21 21 3 21 3 8"></polyline>
                                        <rect x="1" y="3" width="22" height="5"></rect>
                                        <line x1="10" y1="12" x2="14" y2="12"></line>
                                    </svg>
                                </button>
                                <button class="task-btn delete" onclick="event.stopPropagation(); deleteTask('${task.id}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

function renderNotes() {
    const container = document.getElementById('notesList');
    const empty = document.getElementById('notesEmpty');
    const notesContainer = document.getElementById('notesContainer');
    
    // Filter notes by customer
    let notes = state.notes;
    if (state.currentCustomer !== 'all') {
        notes = notes.filter(n => n.customerId === state.currentCustomer);
    }
    
    if (notes.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        empty.innerHTML = `
            <div class="empty-state-icon"></div>
            
        `;
        // Collapse when empty
        notesContainer.classList.remove('has-notes');
        notesContainer.classList.add('empty-notes');
        return;
    }
    
    // Expand when notes exist
    notesContainer.classList.remove('empty-notes');
    notesContainer.classList.add('has-notes');
    
    empty.style.display = 'none';
    const gradients = [
        'linear-gradient(135deg, #023747 0%, #127c87 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #c13584 100%)',
        'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
        'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
        'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
        'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    ];
    
        container.innerHTML = notes.map((note, i) => `
        <div class="note-box" style="background: ${gradients[i % gradients.length]}" draggable="true" data-note-id="${note.id}">
            <div class="note-number">${i + 1}</div>
${note.customerName ? `<div style="font-size: 0.7rem; font-weight: 700; opacity: 0.9; margin-bottom: 0.35rem;"> ${escapeHtml(note.customerName)}</div>` : ''}
<div class="note-content">${escapeHtml(note.content)}</div>

            <div class="note-actions">
                <button class="note-btn" onclick="event.stopPropagation(); editNote('${note.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="note-btn" onclick="event.stopPropagation(); deleteNote('${note.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    // Statistics feature removed
}

function closeNoteModal() {
    document.getElementById('noteModal').classList.remove('active');
    state.editingNote = null;
}
        
function handleSearch(e) {
    state.searchQuery = e.target.value.toLowerCase();
    render();
    
    // Also filter dashboard sections if visible
    if (document.getElementById('customerActivitySection').classList.contains('active')) {
        renderCustomerActivity();
    }
    if (document.getElementById('allCustomersSection').classList.contains('active')) {
        renderAllCustomersList();
    }
    if (document.getElementById('upcomingMeetingsSection').classList.contains('active')) {
        renderUpcomingMeetings();
    }
}

function toggleTheme() {
    const current = document.body.dataset.theme;
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    // Add transition class
    document.body.style.transition = 'none';
    
    // Change theme
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    saveSettingsToFirestore();
    
    // Re-enable transitions after a tick
    requestAnimationFrame(() => {
        document.body.style.transition = '';
    });
    
    // Show toast with theme icon
    const icon = newTheme === 'dark' ? '<span class="icon icon-moon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>' : '<span class="icon icon-sun"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></span>';
    showToast(`${icon} ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`, 'success');
}

let saveTimeout;
        
function saveData() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        // Always write to localStorage first — this must never fail
        try {
            localStorage.setItem('cnotes_tasks', JSON.stringify(state.tasks));
            localStorage.setItem('cnotes_notes', JSON.stringify(state.notes));
            localStorage.setItem('cnotes_customers', JSON.stringify(state.customers));
            localStorage.setItem('cnotes_meetings', JSON.stringify(state.meetings));
            localStorage.setItem('cnotes_CustomerInfos', JSON.stringify(state.CustomerInfos));
            localStorage.setItem('cnotes_meetingTabs', JSON.stringify(state.meetingTabs));
        } catch (localErr) {
            console.error('localStorage save failed:', localErr);
        }

        // Then sync to Firestore only if signed in and online
        if (auth.currentUser && navigator.onLine) {
            try {
                await saveUserDataToFirestore();
            } catch (err) {
                console.error('Firestore save failed:', err);
                showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Cloud save failed — changes saved locally', 'error');
            }
        }
    }, 300);
}




// ========== EXPORT ALL DATA ==========
function exportAllData() {
    const userId = state.currentUser?.id || 'default';
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        exportedBy: state.currentUser?.name || 'Unknown',
        data: {
            tasks: state.tasks,
            notes: state.notes,
            customers: state.customers,
            meetings: state.meetings,
            CustomerInfos: state.CustomerInfos,
            meetingTabs: state.meetingTabs,
            sharedMeetings: state.sharedMeetings,
            myShares: state.myShares,
            customMeetingTypes: JSON.parse(localStorage.getItem('cnotes_customMeetingTypes') || '[]'),
            theme: localStorage.getItem('theme') || 'light'
        }
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cnotes_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> All data exported!', 'success');
}

// ========== IMPORT ALL DATA ==========
function importAllData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate structure
            if (!importedData.data) {
                throw new Error('Invalid backup file format');
            }
            
            // Show confirmation with details
            const stats = {
                tasks: importedData.data.tasks?.length || 0,
                notes: importedData.data.notes?.length || 0,
                customers: importedData.data.customers?.length || 0,
                meetings: importedData.data.meetings?.length || 0,
                CustomerInfos: importedData.data.CustomerInfos?.length || 0
            };
            
            const message = `Import will replace ALL current data with:
• ${stats.tasks} tasks
• ${stats.notes} notes  
• ${stats.customers} customers
• ${stats.meetings} meetings
• ${stats.CustomerInfos} customer infos

This cannot be undone. Continue?`;
            
            showConfirm('<span class="icon icon-download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>', 'Import Data?', message, () => {
                performImport(importedData);
            });
            
        } catch (error) {
            console.error('Import error:', error);
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Invalid file format', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input so same file can be selected again
    event.target.value = '';
}

function performImport(importedData) {
    const data = importedData.data;
    
    // Import all data
    if (data.tasks) state.tasks = data.tasks;
    if (data.notes) state.notes = data.notes;
    if (data.customers) state.customers = data.customers;
    if (data.meetings) state.meetings = data.meetings;
    if (data.CustomerInfos) state.CustomerInfos = data.CustomerInfos;
    if (data.meetingTabs) state.meetingTabs = data.meetingTabs;
    if (data.sharedMeetings) state.sharedMeetings = data.sharedMeetings;
    if (data.myShares) state.myShares = data.myShares;
    
    // Import custom meeting types
    if (data.customMeetingTypes) {
        localStorage.setItem('cnotes_customMeetingTypes', JSON.stringify(data.customMeetingTypes));
    }
    
    // Import theme
    if (data.theme) {
        localStorage.setItem('theme', data.theme);
        document.body.dataset.theme = data.theme;
    }
    
    // Save everything
    saveData();
    saveSharingData();
    
    // Refresh UI
    renderCustomerFilters();
    renderTasks();
    renderNotes();
    updateStats();
    
    // Reload custom meeting types in the form
    // Clear existing custom pills first
    document.querySelectorAll('.meeting-type-pill[data-custom-type]').forEach(el => el.remove());
    loadCustomMeetingTypes();
    
    showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Imported successfully! (${importedData.exportDate?.split('T')[0] || 'Unknown date'})`, 'success');
    
    // Go to dashboard
    showDashboard();
}

                function loadData() {
            const tasks = localStorage.getItem('cnotes_tasks');
            const notes = localStorage.getItem('cnotes_notes');
            const customers = localStorage.getItem('cnotes_customers');
            const meetings = localStorage.getItem('cnotes_meetings');
            const CustomerInfos = localStorage.getItem('cnotes_CustomerInfos');
            const meetingTabs = localStorage.getItem('cnotes_meetingTabs');
            const theme = localStorage.getItem('theme');
            if (tasks) state.tasks = JSON.parse(tasks);
            if (notes) state.notes = JSON.parse(notes);
            if (customers) state.customers = JSON.parse(customers);
            if (meetings) state.meetings = JSON.parse(meetings);
            if (CustomerInfos) state.CustomerInfos = JSON.parse(CustomerInfos);
            if (meetingTabs) {
                state.meetingTabs = JSON.parse(meetingTabs);
            } else {
                state.meetingTabs = [
                    { id: 'all', name: 'All Meetings', icon: '', isDefault: true },
                    { id: 'individual', name: 'Individual', icon: '', isDefault: true }
                ];
            }
            if (theme) document.body.dataset.theme = theme;
        }

function fixDuplicateMeetingIds() {
    const seenIds = new Set();
    let fixedCount = 0;
    
    state.meetings.forEach(meeting => {
        if (seenIds.has(meeting.id)) {
            // This is a duplicate - generate new unique ID
            const oldId = meeting.id;
            meeting.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Update any tasks that reference this meeting
            state.tasks.forEach(task => {
                if (task.meetingId === oldId) {
                    task.meetingId = meeting.id;
                }
            });
            
            fixedCount++;
            console.log(`Fixed duplicate meeting ID: ${oldId} -> ${meeting.id}`);
        }
        seenIds.add(meeting.id);
    });
    
    if (fixedCount > 0) {
        saveData();
        console.log(`Fixed ${fixedCount} duplicate meeting ID(s)`);
    }
}

        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.innerHTML = message;
            toast.className = `toast ${type} active`;
            setTimeout(() => toast.classList.remove('active'), 3000);
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

// Section collapse/expand
function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCustomerLogo(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return getBuildingSVG(20);
    
    if (customer.website) {
        let domain = customer.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        return `<img src="${logoUrl}" 
            alt="${escapeHtml(customer.name)}" 
            style="width: 28px; height: 28px; border-radius: 5px; object-fit: contain; background: white; padding: 3px;"
            onerror="this.outerHTML=getBuildingSVG(20)">`;
    }
    
    return getBuildingSVG(20);
}

// Section collapse/expand
function toggleSection(header) {
    const section = header.parentElement;
    section.classList.toggle('collapsed');
}

function toggleCustomerSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
    }
}

function getBuildingSVG(size = 14, color = 'currentColor') {
    return `<svg viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; stroke: ${color}; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; vertical-align: middle;"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>`;
}

function getCalendarSVG(size = 14, color = 'currentColor') {
    return `<svg viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; stroke: ${color}; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; vertical-align: middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
}

function getCheckboxSVG(size = 14, color = 'currentColor') {
    return `<svg viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; stroke: ${color}; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; vertical-align: middle;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`;
}

// CustomerInfo templates
function applyPrepTemplate(type) {
    const templates = {
        discovery: {
            goals: "• Understand current workflow and challenges\n• Identify key stakeholders\n• Determine budget and timeline\n• Establish decision-making process",
            discussion: "• Current solution and pain points\n• Team size and structure\n• Key metrics and KPIs\n• Decision criteria and timeline",
            outcomes: "• Clear understanding of their needs\n• Next meeting scheduled\n• Follow-up materials sent"
        },
        demo: {
            goals: "• Showcase key features relevant to their needs\n• Address technical questions\n• Demonstrate ROI\n• Secure commitment for next steps",
            discussion: "• Product walkthrough\n• Integration requirements\n• Security and compliance\n• Pricing and packages",
            outcomes: "• Proof of concept agreed\n• Technical requirements documented\n• Trial period scheduled"
        },
        quarterly: {
            goals: "• Review progress and metrics\n• Discuss challenges and wins\n• Plan for next quarter\n• Identify expansion opportunities",
            discussion: "• Usage metrics and adoption\n• Feedback and feature requests\n• Upcoming initiatives\n• Renewal timeline",
            outcomes: "• Action items documented\n• Renewal discussion initiated\n• Next review scheduled"
        },
        negotiation: {
            goals: "• Address pricing concerns\n• Finalize terms and conditions\n• Secure commitment\n• Close the deal",
            discussion: "• Pricing and discounts\n• Contract terms\n• Implementation timeline\n• Success metrics",
            outcomes: "• Agreement on terms\n• Contract sent for signature\n• Kickoff meeting scheduled"
        }
    };
    
    const template = templates[type];
    if (template) {
        document.getElementById('CustomerInfoGoals').value = template.goals;
        document.getElementById('CustomerInfoDiscussionPoints').value = template.discussion;
        document.getElementById('CustomerInfoOutcomes').value = template.outcomes;
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} template applied!`, 'success');
    }
}

// Meeting type selection
function selectMeetingType(type) {
    document.querySelectorAll('.meeting-type-pill').forEach(pill => pill.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('meetingType').value = type;
}

function selectMeetingType(type) {
    document.querySelectorAll('.meeting-type-pill').forEach(pill => pill.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('meetingType').value = type;
}

// Custom Meeting Type Functions
// Icon key to SVG mapping for meeting types
const meetingTypeIconMap = {
    'search': '<span class="icon icon-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>',
    'phone': '<span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>',
    'film': '<span class="icon icon-film"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg></span>',
    'briefcase': '<span class="icon icon-briefcase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>',
    'calendar': '<span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>',
    'clipboard': '<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span>',
    'handshake': '<span class="icon icon-handshake"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg></span>',
    'lightbulb': '<span class="icon icon-lightbulb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg></span>',
    'zap': '<span class="icon icon-zap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>',
    'target': '<span class="icon icon-target"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>',
    'rocket': '<span class="icon icon-rocket"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></span>',
    'bar-chart': '<span class="icon icon-bar-chart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg></span>',
    'award': '<span class="icon icon-award"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></span>',
    'trophy': '<span class="icon icon-trophy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>',
    'settings': '<span class="icon icon-settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>',
    'bell': '<span class="icon icon-bell"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>',
    'message': '<span class="icon icon-message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>',
    'smartphone': '<span class="icon icon-smartphone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>',
    'sparkle': '<span class="icon icon-sparkle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813L20 10l-6.088 1.187L12 17l-1.912-5.813L4 10l6.088-1.187L12 3z"/></svg></span>',
    'flame': '<span class="icon icon-flame"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span>',
    'check': '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>',
    'star': '<span class="icon icon-star"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>',
    'party': '<span class="icon icon-party"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3L2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="M22 13l-1.34-.45a2.9 2.9 0 0 0-3.12 1.96v0a1.53 1.53 0 0 1-1.63 1.45h0a1.77 1.77 0 0 0-1.44 1.76L14 20"/></svg></span>',
    'trending-up': '<span class="icon icon-trending-up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>',
};

function iconKeyToSvg(key) {
    return meetingTypeIconMap[key] || key;
}

let selectedCustomMeetingTypeIcon = '';

function addCustomMeetingType() {
    openCustomMeetingTypeModal();
}

function openCustomMeetingTypeModal(editSlug = null) {
    selectedCustomMeetingTypeIcon = '';
    
    if (editSlug) {
        const customTypes = JSON.parse(localStorage.getItem('cnotes_customMeetingTypes') || '[]');
        const type = customTypes.find(t => t.slug === editSlug);
        
        if (type) {
            document.getElementById('customMeetingTypeModalTitle').textContent = 'Edit Meeting Type';
            document.getElementById('editingMeetingTypeSlug').value = editSlug;
            document.getElementById('customMeetingTypeName').value = type.name;
            document.getElementById('selectedMeetingTypeIcon').value = type.icon;
            selectedCustomMeetingTypeIcon = type.icon;
            
            // Select the icon
            document.querySelectorAll('.meeting-type-icon-option').forEach(btn => {
                btn.classList.remove('selected');
                if ((btn.dataset.icon === type.icon || iconKeyToSvg(btn.dataset.icon) === type.icon)) {
                    btn.classList.add('selected');
                }
            });
        }
    } else {
        document.getElementById('customMeetingTypeModalTitle').textContent = 'Add Meeting Type';
        document.getElementById('customMeetingTypeForm').reset();
        document.querySelectorAll('.meeting-type-icon-option').forEach(btn => {
            btn.classList.remove('selected');
        });
    }
    
    // Setup icon selection
    document.querySelectorAll('.meeting-type-icon-option').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.meeting-type-icon-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedCustomMeetingTypeIcon = this.dataset.icon;
            document.getElementById('selectedMeetingTypeIcon').value = iconKeyToSvg(this.dataset.icon);
            document.getElementById('customMeetingTypeEmoji').value = '';
        });
    });
    
    // Setup custom emoji input
    const emojiInput = document.getElementById('customMeetingTypeEmoji');
    const newEmojiInput = emojiInput.cloneNode(true);
    emojiInput.parentNode.replaceChild(newEmojiInput, emojiInput);
    
    newEmojiInput.addEventListener('input', function() {
        if (this.value.trim()) {
            selectedCustomMeetingTypeIcon = this.value.trim();
            document.getElementById('selectedMeetingTypeIcon').value = this.value.trim();
            document.querySelectorAll('.meeting-type-icon-option').forEach(b => b.classList.remove('selected'));
        }
    });
    
    document.getElementById('customMeetingTypeModal').classList.add('active');
}

function closeCustomMeetingTypeModal() {
    document.getElementById('customMeetingTypeModal').classList.remove('active');
    selectedCustomMeetingTypeIcon = '';
}

function handleCustomMeetingTypeSubmit(e) {
    e.preventDefault();
    
    const typeName = document.getElementById('customMeetingTypeName').value.trim();
    const customEmoji = document.getElementById('customMeetingTypeEmoji').value.trim();
    const typeIcon = customEmoji || iconKeyToSvg(selectedCustomMeetingTypeIcon) || '<span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span>';
    const editingSlug = document.getElementById('editingMeetingTypeSlug').value;
    
    if (!typeName) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter type name', 'error');
        return;
    }
    
    if (!typeIcon) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Select an icon', 'error');
        return;
    }
    
    const typeSlug = typeName.toLowerCase().replace(/\s+/g, '-');
    
    let customTypes = JSON.parse(localStorage.getItem('cnotes_customMeetingTypes') || '[]');
    
    if (editingSlug) {
        // Update existing type
        const index = customTypes.findIndex(t => t.slug === editingSlug);
        if (index !== -1) {
            customTypes[index] = { slug: typeSlug, name: typeName, icon: typeIcon };
            
            // Update the pill
            const pill = document.querySelector(`[data-custom-type="${editingSlug}"]`);
            if (pill) {
                pill.setAttribute('data-custom-type', typeSlug);
                pill.onclick = function() { selectCustomMeetingType(typeSlug, typeIcon); };
                pill.innerHTML = `
                    <span class="meeting-type-icon">${typeIcon}</span>
                    <span>${typeName}</span>
                    <span style="margin-left: auto; cursor: pointer; opacity: 0.7; padding: 0 0.5rem;" onclick="event.stopPropagation(); editCustomMeetingType('${typeSlug}')"><span class="icon icon-pencil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></span></span>
                    <span style="cursor: pointer; opacity: 0.7;" onclick="event.stopPropagation(); removeCustomMeetingType('${typeSlug}', this.parentElement)">×</span>
                `;
            }
            
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Type updated!', 'success');
        }
    } else {
        // Check if type already exists
        if (customTypes.some(t => t.slug === typeSlug)) {
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Type already exists', 'error');
            return;
        }
        
        // Add new type
customTypes.push({ slug: typeSlug, name: typeName, icon: typeIcon });

// Create new pill
const container = document.getElementById('meetingTypePills');
const addButton = container.querySelector('button[onclick="addCustomMeetingType()"]');

const newPill = document.createElement('div');
newPill.className = 'meeting-type-pill';
newPill.setAttribute('data-custom-type', typeSlug);
newPill.onclick = function() { selectCustomMeetingType(typeSlug, typeIcon); };
newPill.innerHTML = `
    <span class="meeting-type-icon">${typeIcon}</span>
    <span>${typeName}</span>
    <span style="margin-left: auto; cursor: pointer; opacity: 0.7; padding: 0 0.5rem;" onclick="event.stopPropagation(); editCustomMeetingType('${typeSlug}')"><span class="icon icon-pencil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></span></span>
    <span style="cursor: pointer; opacity: 0.7;" onclick="event.stopPropagation(); removeCustomMeetingType('${typeSlug}', this.parentElement)">×</span>
`;

container.insertBefore(newPill, addButton);

// AUTO-SELECT the newly created type
document.querySelectorAll('.meeting-type-pill').forEach(pill => pill.classList.remove('selected'));
newPill.classList.add('selected');
document.getElementById('meetingType').value = typeSlug;
const form = document.getElementById('meetingForm');
if (form) {
    form.setAttribute('data-custom-type-icon', typeIcon);
}

showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> "${typeName}" type added and selected!`, 'success');
    }
    
    localStorage.setItem('cnotes_customMeetingTypes', JSON.stringify(customTypes));
    closeCustomMeetingTypeModal();
}

function selectCustomMeetingType(typeSlug, typeIcon) {
    document.querySelectorAll('.meeting-type-pill').forEach(pill => pill.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('meetingType').value = typeSlug;
    
    // Store custom icon for this meeting
    const form = document.getElementById('meetingForm');
    if (form) {
        form.setAttribute('data-custom-type-icon', typeIcon);
    }
}

function editCustomMeetingType(typeSlug) {
    openCustomMeetingTypeModal(typeSlug);
}

function removeCustomMeetingType(typeSlug, element) {
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete Type?', 'Remove this meeting type?', () => {
        element.remove();
        
        // Remove from localStorage
        let customTypes = JSON.parse(localStorage.getItem('cnotes_customMeetingTypes') || '[]');
        customTypes = customTypes.filter(t => t.slug !== typeSlug);
        localStorage.setItem('cnotes_customMeetingTypes', JSON.stringify(customTypes));
        
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Type removed!', 'success');
    });
}

function loadCustomMeetingTypes() {
    const customTypes = JSON.parse(localStorage.getItem('cnotes_customMeetingTypes') || '[]');
    const container = document.getElementById('meetingTypePills');
    const addButton = container.querySelector('button[onclick="addCustomMeetingType()"]');
    
    customTypes.forEach(type => {
        const newPill = document.createElement('div');
        newPill.className = 'meeting-type-pill';
        newPill.setAttribute('data-custom-type', type.slug);
        newPill.onclick = function() { selectCustomMeetingType(type.slug, type.icon); };
        newPill.innerHTML = `
            <span class="meeting-type-icon">${type.icon}</span>
            <span>${type.name}</span>
            <span style="margin-left: auto; cursor: pointer; opacity: 0.7; padding: 0 0.5rem;" onclick="event.stopPropagation(); editCustomMeetingType('${type.slug}')"><span class="icon icon-pencil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></span></span>
            <span style="cursor: pointer; opacity: 0.7;" onclick="event.stopPropagation(); removeCustomMeetingType('${type.slug}', this.parentElement)">×</span>
        `;
        container.insertBefore(newPill, addButton);
    });
}



function removeParticipant(index) {
    state.meetingParticipants.splice(index, 1);
    
    // Reset editing state if we're deleting the participant being edited
    if (state.editingParticipantIndex === index) {
        state.editingParticipantIndex = null;
        document.getElementById('addParticipantBtn').innerHTML = '+ Add Participant';
        document.getElementById('participantNameInput').value = '';
        document.getElementById('participantRoleInput').value = '';
        document.getElementById('participantEmailInput').value = '';
        document.getElementById('participantPhoneInput').value = '';
    } else if (state.editingParticipantIndex !== null && state.editingParticipantIndex > index) {
        // Adjust index if we deleted someone before the one being edited
        state.editingParticipantIndex--;
    }
    
    renderParticipantsList();
}



// MEDDPICC visual tracker update
function updateMeddpiccVisualTracker() {
    const fields = ['Metrics', 'EconomicBuyer', 'DecisionCriteria', 'DecisionProcess', 'PaperProcess', 'Pain', 'Champion', 'Competition'];
    fields.forEach(field => {
        const value = document.getElementById(`meddpicc${field}`).value.trim();
        const tracker = document.querySelector(`.meddpicc-tracker-item[onclick="focusMeddpiccField('${field}')"]`);
        if (value) {
            tracker.classList.add('completed');
        } else {
            tracker.classList.remove('completed');
        }
    });
}

function focusMeddpiccField(field) {
    document.getElementById(`meddpicc${field}`).focus();
}

// Update existing openInlineMeetingForm to set up trackers
const originalOpenMeetingForm = openInlineMeetingForm;
openInlineMeetingForm = function(meeting = null, isPastMeeting = true, isSharedPreview = false) {
    originalOpenMeetingForm(meeting, isPastMeeting, isSharedPreview);
    
    // Set up meeting type
    if (meeting && meeting.type) {
        document.querySelectorAll('.meeting-type-pill').forEach(pill => {
            if (pill.onclick.toString().includes(meeting.type)) {
                pill.classList.add('selected');
            }
        });
    }
    
    
    // Update MEDDPICC tracker
    setTimeout(updateMeddpiccVisualTracker, 100);
};


// Add input listeners for MEDDPICC fields
document.addEventListener('DOMContentLoaded', () => {
    ['Metrics', 'EconomicBuyer', 'DecisionCriteria', 'DecisionProcess', 'PaperProcess', 'Pain', 'Champion', 'Competition'].forEach(field => {
        const element = document.getElementById(`meddpicc${field}`);
        if (element) {
            element.addEventListener('input', updateMeddpiccVisualTracker);
        }
    });
});

// Meeting Tabs Functions
function switchMeetingTab(tabId) {
    state.currentMeetingTab = tabId;
    if (state.currentCustomer !== 'all') {
        showCustomerMeetingsSection(state.currentCustomer);
    }
}

function openCreateTabModal(tabId = null, event = null) {
    console.log('openCreateTabModal called'); // DEBUG
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (tabId) {
        const tab = state.meetingTabs.find(t => t.id === tabId);
        if (tab && !tab.isDefault) {
            state.editingTabId = tabId;
            document.getElementById('tabModalTitle').textContent = 'Edit Meeting Tab';
            document.getElementById('editingTabId').value = tabId;
            document.getElementById('tabName').value = tab.name;
            document.getElementById('tabIcon').value = tab.icon || '';
            state.selectedTabIcon = tab.icon || '';
            
            document.querySelectorAll('.tab-icon-option').forEach(btn => {
                btn.style.background = '';
                btn.style.color = '';
                if (btn.dataset.icon === tab.icon) {
                    btn.style.background = 'var(--primary)';
                    btn.style.color = 'white';
                }
            });
        }
    } else {
        state.editingTabId = null;
        document.getElementById('createTabForm').reset();
        state.selectedTabIcon = '';
        document.querySelectorAll('.tab-icon-option').forEach(btn => {
            btn.style.background = '';
            btn.style.color = '';
        });
    }
    
    // Attach icon button listeners NOW since they exist in the modal
    document.querySelectorAll('.tab-icon-option').forEach(btn => {
        // Remove old listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new listener
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Icon clicked:', this.dataset.icon); // DEBUG
            
            document.querySelectorAll('.tab-icon-option').forEach(b => {
                b.style.background = '';
                b.style.color = '';
            });
            this.style.background = 'var(--primary)';
            this.style.color = 'white';
            state.selectedTabIcon = this.dataset.icon;
            document.getElementById('tabIcon').value = this.dataset.icon;
        });
    });
    
    document.getElementById('createTabModal').classList.add('active');
}

function closeCreateTabModal() {
    document.getElementById('createTabModal').classList.remove('active');
    state.editingTabId = null;
    state.selectedTabIcon = '';
}

function handleTabFormSubmit(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log('handleTabFormSubmit called!'); // DEBUG
    
    const name = document.getElementById('tabName').value.trim();
    const icon = document.getElementById('tabIcon').value || state.selectedTabIcon;
    
    console.log('Tab name:', name); // DEBUG
    
    if (!name) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter tab name', 'error');
        return;
    }
    
    if (state.editingTabId) {
        const tab = state.meetingTabs.find(t => t.id === state.editingTabId);
        if (tab) {
            tab.name = name;
            tab.icon = icon;
            showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Tab updated!', 'success');
        }
    } else {
        const newTab = {
            id: Date.now().toString(),
            name: name,
            icon: icon,
            isDefault: false
        };
        state.meetingTabs.push(newTab);
        console.log('New tab created:', newTab); // DEBUG
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Tab created!', 'success');
    }
    
    saveData();
    closeCreateTabModal();
    
    if (state.currentCustomer !== 'all') {
        showCustomerMeetingsSection(state.currentCustomer);
    }
}


function showTabContextMenu(event, tabId) {
    const tab = state.meetingTabs.find(t => t.id === tabId);
    if (!tab || tab.isDefault) return;
    
    const menu = document.getElementById('tabContextMenu');
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';
    menu.classList.add('active');
    menu.dataset.tabId = tabId;
    
    document.addEventListener('click', closeTabContextMenu);
}

function closeTabContextMenu() {
    const menu = document.getElementById('tabContextMenu');
    menu.classList.remove('active');
    document.removeEventListener('click', closeTabContextMenu);
}

function renameTab() {
    const menu = document.getElementById('tabContextMenu');
    const tabId = menu.dataset.tabId;
    closeTabContextMenu();
    openCreateTabModal(tabId);
}

function deleteTab() {
    const menu = document.getElementById('tabContextMenu');
    const tabId = menu.dataset.tabId;
    closeTabContextMenu();
    deleteTabConfirm(tabId);
}

function deleteTabQuick(tabId) {
    deleteTabConfirm(tabId);
}

function deleteTabConfirm(tabId) {
    const tab = state.meetingTabs.find(t => t.id === tabId);
    if (!tab || tab.isDefault) return;
    
    const meetingsInTab = state.meetings.filter(m => m.tabId === tabId);
    const message = meetingsInTab.length > 0
        ? `Delete "${tab.name}"? ${meetingsInTab.length} meeting(s) will be moved to "Individual".`
        : `Delete "${tab.name}"?`;
    
    showConfirm('<span class="icon icon-trash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></span>', 'Delete Tab?', message, () => {
        // Move meetings to individual
        state.meetings.forEach(m => {
            if (m.tabId === tabId) {
                m.tabId = 'individual';
            }
        });
        
        // Remove tab
        state.meetingTabs = state.meetingTabs.filter(t => t.id !== tabId);
        
        // Switch to all tab if we deleted current tab
        if (state.currentMeetingTab === tabId) {
            state.currentMeetingTab = 'all';
        }
        
        saveData();
        
        if (state.currentCustomer !== 'all') {
            showCustomerMeetingsSection(state.currentCustomer);
        }
        
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Tab deleted!', 'success');
    });
}

function handleMeetingDragStart(event, meetingId) {
    state.draggedMeetingId = meetingId;
    event.target.classList.add('meeting-card-dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', meetingId);
}

function handleMeetingDragEnd(event) {
    event.target.classList.remove('meeting-card-dragging');
    state.draggedMeetingId = null;
    
    // Hide drop zone
    const dropZone = document.getElementById('meetingsDropZone');
    if (dropZone) dropZone.classList.remove('active');
    
    // Remove drag-over from all tabs
    document.querySelectorAll('.meeting-tab').forEach(tab => {
        tab.classList.remove('drag-over');
    });
}

function handleTabDragOver(event, tabId) {
    if (!state.draggedMeetingId) return;
    
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    const tab = event.currentTarget;
    tab.classList.add('drag-over');
    
    // Show drop zone if on this tab
    if (state.currentMeetingTab === tabId) {
        const dropZone = document.getElementById('meetingsDropZone');
        if (dropZone) dropZone.classList.add('active');
    }
}

function handleTabDragLeave(event) {
    const tab = event.currentTarget;
    tab.classList.remove('drag-over');
}

function handleTabDrop(event, tabId) {
    event.preventDefault();
    
    const meetingId = state.draggedMeetingId || event.dataTransfer.getData('text/plain');
    if (!meetingId) return;
    
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    const tab = state.meetingTabs.find(t => t.id === tabId);
    if (!tab) return;
    
    // Update meeting tab
    meeting.tabId = tabId;
    
    saveData();
    
    // Refresh view
    if (state.currentCustomer !== 'all') {
        showCustomerMeetingsSection(state.currentCustomer);
    }
    
    showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Moved to "${tab.name}"!`, 'success');
}

// ============================================
// FOLLOW-UP PARTICIPANT MANAGEMENT
// ============================================

let followUpParticipants = [];

function loadFollowUpQuickAddContacts(customerId) {
    const container = document.getElementById('followUpQuickAddContacts');
    const list = document.getElementById('followUpQuickAddList');
    
    if (!customerId) {
        container.style.display = 'none';
        return;
    }
    
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) {
        container.style.display = 'none';
        return;
    }
    
    // Collect all unique contacts for this customer
    const contactsMap = new Map();
    
    // Add standalone contacts
    if (customer.participants) {
        customer.participants.forEach(p => {
            const key = p.email && p.email.trim() 
                ? p.email.toLowerCase().trim() 
                : p.name.toLowerCase().trim();
            if (!contactsMap.has(key)) {
                contactsMap.set(key, p);
            }
        });
    }
    
    // Add contacts from previous meetings
    const customerMeetings = state.meetings.filter(m => m.customerId === customerId);
    customerMeetings.forEach(meeting => {
        if (meeting.participants) {
            meeting.participants.forEach(p => {
                const key = p.email && p.email.trim() 
                    ? p.email.toLowerCase().trim() 
                    : p.name.toLowerCase().trim();
                if (!contactsMap.has(key)) {
                    contactsMap.set(key, p);
                }
            });
        }
    });
    
    const contacts = Array.from(contactsMap.values());
    
    if (contacts.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    // Filter out already selected participants
    const availableContacts = contacts.filter(contact => {
        const key = contact.email && contact.email.trim() 
            ? contact.email.toLowerCase().trim() 
            : contact.name.toLowerCase().trim();
        
        return !followUpParticipants.some(p => {
            const pKey = p.email && p.email.trim() 
                ? p.email.toLowerCase().trim() 
                : p.name.toLowerCase().trim();
            return pKey === key;
        });
    });
    
    if (availableContacts.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    // Render contacts
    list.innerHTML = availableContacts.map(contact => {
        const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const details = [];
        if (contact.role) details.push(contact.role);
        if (contact.email) details.push(contact.email);
        if (contact.phone) details.push(contact.phone);
        
        const contactJson = JSON.stringify(contact).replace(/"/g, '&quot;');
        
        return `
            <div class="quick-add-contact-item" onclick='quickAddFollowUpParticipant(${contactJson})'>
                <div class="quick-add-contact-avatar">${initials}</div>
                <div class="quick-add-contact-info">
                    <div class="quick-add-contact-name">${escapeHtml(contact.name)}</div>
                    ${details.length > 0 ? `<div class="quick-add-contact-details">${escapeHtml(details.join(' • '))}</div>` : ''}
                </div>
                <div class="quick-add-contact-icon"><span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span></div>
            </div>
        `;
    }).join('');
    
    container.style.display = 'block';
}

function quickAddFollowUpParticipant(contactData) {
    // Check if already added
    const key = contactData.email && contactData.email.trim() 
        ? contactData.email.toLowerCase().trim() 
        : contactData.name.toLowerCase().trim();
    
    const alreadyAdded = followUpParticipants.some(p => {
        const pKey = p.email && p.email.trim() 
            ? p.email.toLowerCase().trim() 
            : p.name.toLowerCase().trim();
        return pKey === key;
    });
    
    if (alreadyAdded) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Already added', 'error');
        return;
    }
    
    // Add participant
    followUpParticipants.push({
        name: contactData.name,
        role: contactData.role || '',
        email: contactData.email || '',
        phone: contactData.phone || ''
    });
    
    renderFollowUpParticipantsList();
    
    // **FIXED: Refresh quick-add list using the correct customer ID source**
    // Get customer ID from either selected meetings or customer filter
    let customerId = null;
    
    if (selectedFollowUpMeetings.length > 0) {
        const meetings = selectedFollowUpMeetings.map(id => state.meetings.find(m => m.id === id));
        customerId = meetings[0]?.customerId;
    } else if (state.currentCustomer && state.currentCustomer !== 'all') {
        customerId = state.currentCustomer;
    } else {
        const customerFilter = document.getElementById('followUpCustomerFilter').value;
        if (customerFilter !== 'all') {
            customerId = customerFilter;
        }
    }
    
    if (customerId) {
        loadFollowUpQuickAddContacts(customerId);
    }
    
    updateFollowUpPreview();
    showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> ${contactData.name} added!`, 'success');
}


function addFollowUpParticipant() {
    const name = document.getElementById('followUpParticipantName').value.trim();
    const role = document.getElementById('followUpParticipantRole').value.trim();
    const email = document.getElementById('followUpParticipantEmail').value.trim();
    const phone = document.getElementById('followUpParticipantPhone').value.trim();
    
    if (!name) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter participant name', 'error');
        return;
    }
    
    // Check if already added
    const key = email && email.trim() ? email.toLowerCase().trim() : name.toLowerCase().trim();
    const alreadyAdded = followUpParticipants.some(p => {
        const pKey = p.email && p.email.trim() 
            ? p.email.toLowerCase().trim() 
            : p.name.toLowerCase().trim();
        return pKey === key;
    });
    
    if (alreadyAdded) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Participant already added', 'error');
        return;
    }
    
    followUpParticipants.push({ name, role, email, phone });
    
    // Clear form
    document.getElementById('followUpParticipantName').value = '';
    document.getElementById('followUpParticipantRole').value = '';
    document.getElementById('followUpParticipantEmail').value = '';
    document.getElementById('followUpParticipantPhone').value = '';
    
    renderFollowUpParticipantsList();
    
    // **FIXED: Refresh quick-add list using the correct customer ID source**
    let customerId = null;
    
    if (selectedFollowUpMeetings.length > 0) {
        const meetings = selectedFollowUpMeetings.map(id => state.meetings.find(m => m.id === id));
        customerId = meetings[0]?.customerId;
    } else if (state.currentCustomer && state.currentCustomer !== 'all') {
        customerId = state.currentCustomer;
    } else {
        const customerFilter = document.getElementById('followUpCustomerFilter').value;
        if (customerFilter !== 'all') {
            customerId = customerFilter;
        }
    }
    
    if (customerId) {
        loadFollowUpQuickAddContacts(customerId);
    }
    
    updateFollowUpPreview();
    showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> ${name} added!`, 'success');
}

function removeFollowUpParticipant(index) {
    followUpParticipants.splice(index, 1);
    renderFollowUpParticipantsList();
    
    // **FIXED: Refresh quick-add list to show the removed participant again**
    let customerId = null;
    
    if (selectedFollowUpMeetings.length > 0) {
        const meetings = selectedFollowUpMeetings.map(id => state.meetings.find(m => m.id === id));
        customerId = meetings[0]?.customerId;
    } else if (state.currentCustomer && state.currentCustomer !== 'all') {
        customerId = state.currentCustomer;
    } else {
        const customerFilter = document.getElementById('followUpCustomerFilter').value;
        if (customerFilter !== 'all') {
            customerId = customerFilter;
        }
    }
    
    if (customerId) {
        loadFollowUpQuickAddContacts(customerId);
    }
    
    updateFollowUpPreview();
}

function renderFollowUpParticipantsList() {
    const container = document.getElementById('followUpParticipantsList');
    const countEl = document.getElementById('followUpParticipantsCount');
    
    countEl.textContent = followUpParticipants.length;
    
    if (followUpParticipants.length === 0) {
        container.innerHTML = '<div style="padding: 0.75rem; text-align: center; color: var(--text-secondary); font-size: 0.75rem;">No participants selected</div>';
        return;
    }
    
    container.innerHTML = followUpParticipants.map((participant, index) => {
        const initials = participant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return `
            <div class="participant-card">
                <div class="participant-avatar">${initials}</div>
                <div class="participant-details">
                    <div class="participant-card-name">${escapeHtml(participant.name)}</div>
                    <div class="participant-card-meta">
                        ${participant.role ? `<span><span class="icon icon-briefcase"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span> ${escapeHtml(participant.role)}</span>` : ''}
                        ${participant.email ? `<span><span class="icon icon-mail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span> ${escapeHtml(participant.email)}</span>` : ''}
                        ${participant.phone ? `<span><span class="icon icon-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span> ${escapeHtml(participant.phone)}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button type="button" class="task-btn delete" onclick="removeFollowUpParticipant(${index})" title="Remove">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}



// ============================================
// FOLLOW-UP MEETING FUNCTIONALITY
// ============================================

let selectedFollowUpMeetings = [];
let editingSharedMeetingId = null;

function openFollowUpModal(source = 'past') {
    // Reset state
    selectedFollowUpMeetings = [];
    followUpParticipants = [];
    
    // Update Step title if viewing specific customer
    const step1Title = document.getElementById('followUpStep1Title');
    if (state.currentCustomer && state.currentCustomer !== 'all') {
        const customer = state.customers.find(c => c.id === state.currentCustomer);
        if (customer) {
            step1Title.textContent = `Step 2: Select ${customer.name} Meeting(s)`;
        }
    } else {
        step1Title.textContent = 'Step 2: Select Meeting(s) to Follow Up';
    }
    
    document.getElementById('followUpModal').classList.add('active');
    
    // Scroll modal content to top
    setTimeout(() => {
        const modalContent = document.querySelector('#followUpModal .modal-content > div[style*="padding"]');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 50);
    
    // Set default dates
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 14); // +2 weeks
    upcomingDate.setMinutes(upcomingDate.getMinutes() - upcomingDate.getTimezoneOffset());
    document.getElementById('followUpDateUpcoming').value = upcomingDate.toISOString().slice(0, 16);
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    pastDate.setMinutes(pastDate.getMinutes() - pastDate.getTimezoneOffset());
    document.getElementById('followUpDatePast').value = pastDate.toISOString().slice(0, 16);
    
    // Set radio button based on source
    if (source === 'upcoming') {
        document.querySelector('input[name="followUpType"][value="upcoming"]').checked = true;
        document.querySelector('input[name="followUpType"][value="past"]').checked = false;
    } else {
        document.querySelector('input[name="followUpType"][value="past"]').checked = true;
        document.querySelector('input[name="followUpType"][value="upcoming"]').checked = false;
    }
    
    // Populate customer filter
    populateFollowUpCustomerFilter();
    
    // If viewing a specific customer, pre-filter to that customer
    if (state.currentCustomer && state.currentCustomer !== 'all') {
        document.getElementById('followUpCustomerFilter').value = state.currentCustomer;
        document.getElementById('followUpCustomerFilter').disabled = true;
        document.getElementById('followUpCustomerFilter').style.opacity = '0.6';
        document.getElementById('followUpCustomerFilter').style.cursor = 'not-allowed';
        
        // **NEW: Load quick-add contacts immediately for this customer**
        loadFollowUpQuickAddContacts(state.currentCustomer);
    } else {
        document.getElementById('followUpCustomerFilter').disabled = false;
        document.getElementById('followUpCustomerFilter').style.opacity = '1';
        document.getElementById('followUpCustomerFilter').style.cursor = 'pointer';
        
        // Hide quick-add initially for "all customers" view
        document.getElementById('followUpQuickAddContacts').style.display = 'none';
    }
    
    // Load meetings
    renderFollowUpMeetingsList();
    
    // Clear participant list
    renderFollowUpParticipantsList();
    
    // Update modal title if viewing specific customer
    const modalTitle = document.getElementById('followUpModalTitle');
    if (state.currentCustomer && state.currentCustomer !== 'all') {
        const customer = state.customers.find(c => c.id === state.currentCustomer);
        if (customer) {
            modalTitle.innerHTML = `<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Create Follow-Up for ${customer.name}`;
        }
    } else {
        modalTitle.innerHTML = '<span class="icon icon-refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span> Create Follow-Up Meeting';
    }
    
    updateFollowUpPreview();
    
    // Setup radio button listeners to update preview
    document.querySelectorAll('input[name="followUpType"]').forEach(radio => {
        radio.addEventListener('change', updateFollowUpPreview);
    });
}

function closeFollowUpModal() {
    document.getElementById('followUpModal').classList.remove('active');
    selectedFollowUpMeetings = [];
    followUpParticipants = [];
}

function populateFollowUpCustomerFilter() {
    const select = document.getElementById('followUpCustomerFilter');
    select.innerHTML = '<option value="all">All Customers</option>';
    
    const customers = [...new Set(state.meetings.map(m => m.customerId))];
    customers.forEach(customerId => {
        const customer = state.customers.find(c => c.id === customerId);
        if (customer) {
            const option = document.createElement('option');
            option.value = customerId;
            option.textContent = customer.name;
            select.appendChild(option);
        }
    });
}

function filterFollowUpMeetings() {
    renderFollowUpMeetingsList();
    
    // **Update quick-add contacts when filter changes**
    const customerFilter = document.getElementById('followUpCustomerFilter').value;
    if (customerFilter !== 'all') {
        loadFollowUpQuickAddContacts(customerFilter);
    } else {
        // Hide quick-add when "all customers" is selected
        document.getElementById('followUpQuickAddContacts').style.display = 'none';
    }
}

function renderFollowUpMeetingsList() {
    const container = document.getElementById('followUpMeetingsList');
    const searchQuery = document.getElementById('followUpSearch').value.toLowerCase();
    const customerFilter = document.getElementById('followUpCustomerFilter').value;
    const dateFilterValue = document.getElementById('followUpDateFilter').value;
    const dateFilter = dateFilterValue === 'all' ? 'all' : parseInt(dateFilterValue);
    
    // Filter meetings
    let meetings = [...state.meetings];
    
    // Apply search
    if (searchQuery) {
        meetings = meetings.filter(m => 
            m.title.toLowerCase().includes(searchQuery) ||
            m.customerName.toLowerCase().includes(searchQuery)
        );
    }
    
    // Apply customer filter
    if (customerFilter !== 'all') {
        meetings = meetings.filter(m => m.customerId === customerFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateFilter);
        meetings = meetings.filter(m => new Date(m.date) >= cutoffDate);
    }
    
    // Sort by date (most recent first)
    meetings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render
    container.innerHTML = '';
    
    meetings.forEach(meeting => {
        const div = document.createElement('div');
        div.className = 'follow-up-meeting-item';
        if (selectedFollowUpMeetings.includes(meeting.id)) {
            div.classList.add('selected');
        }
        
        const customer = state.customers.find(c => c.id === meeting.customerId);
        const participants = meeting.participants || [];
        const participantNames = participants.slice(0, 3).map(p => p.name).join(', ');
        const moreParticipants = participants.length > 3 ? ` +${participants.length - 3}` : '';
        
        // Get notes preview (strip HTML)
        const notesText = meeting.notesHTML ? htmlToPlainText(meeting.notesHTML) : meeting.notes || '';
        const notesPreview = notesText.substring(0, 60) + (notesText.length > 60 ? '...' : '');
        
        div.innerHTML = `
            <input type="checkbox" ${selectedFollowUpMeetings.includes(meeting.id) ? 'checked' : ''} 
                   onchange="toggleFollowUpMeeting('${meeting.id}')">
            <div class="follow-up-meeting-info">
                <div class="follow-up-meeting-title">${escapeHtml(meeting.title)} - ${escapeHtml(meeting.customerName)}</div>
                <div class="follow-up-meeting-meta">
                    <span><span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> ${new Date(meeting.date).toLocaleDateString()}</span>
                    ${participantNames ? `<span><span class="icon icon-user"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span> ${escapeHtml(participantNames)}${moreParticipants}</span>` : ''}
                </div>
                ${notesPreview ? `<div class="follow-up-meeting-preview"><span class="icon icon-edit-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span> "${escapeHtml(notesPreview)}"</div>` : ''}
            </div>
        `;
        
        div.onclick = (e) => {
            if (e.target.type !== 'checkbox') {
                toggleFollowUpMeeting(meeting.id);
            }
        };
        
        container.appendChild(div);
    });
}

function toggleFollowUpMeeting(meetingId) {
    const index = selectedFollowUpMeetings.indexOf(meetingId);
    if (index > -1) {
        selectedFollowUpMeetings.splice(index, 1);
    } else {
        selectedFollowUpMeetings.push(meetingId);
    }
    
    renderFollowUpMeetingsList();
    updateFollowUpSelectionCount();
    validateFollowUpSelection();
    
    // Load quick-add contacts when a customer's meeting is selected
    const meetings = selectedFollowUpMeetings.map(id => state.meetings.find(m => m.id === id));
    if (meetings.length > 0 && meetings[0].customerId) {
        loadFollowUpQuickAddContacts(meetings[0].customerId);
    } else {
        document.getElementById('followUpQuickAddContacts').style.display = 'none';
    }
    
    updateFollowUpPreview();
}


function updateFollowUpSelectionCount() {
    const count = selectedFollowUpMeetings.length;
    const countEl = document.getElementById('followUpSelectionCount');
    
    if (count === 0) {
        countEl.textContent = 'No meetings selected';
        countEl.style.color = 'var(--text-secondary)';
    } else if (count === 1) {
        countEl.innerHTML = '<span class="icon icon-check-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> 1 meeting selected';
        countEl.style.color = 'var(--success)';
    } else {
        countEl.innerHTML = `<span class="icon icon-check-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> ${count} meetings selected`;
        countEl.style.color = 'var(--success)';
    }
}

function validateFollowUpSelection() {
    const warningEl = document.getElementById('followUpCustomerWarning');
    const createBtn = document.getElementById('createFollowUpBtn');
    
    if (selectedFollowUpMeetings.length === 0) {
        warningEl.style.display = 'none';
        createBtn.disabled = true;
        return false;
    }
    
    // Check if all selected meetings are from the same customer
    const meetings = selectedFollowUpMeetings.map(id => state.meetings.find(m => m.id === id));
    const customerIds = [...new Set(meetings.map(m => m.customerId))];
    
    if (customerIds.length > 1) {
        warningEl.style.display = 'block';
        createBtn.disabled = true;
        return false;
    }
    
    warningEl.style.display = 'none';
    createBtn.disabled = false;
    return true;
}

function updateFollowUpPreview() {
    const previewContent = document.getElementById('followUpPreviewContent');
    
    // Get meeting type
    const type = document.querySelector('input[name="followUpType"]:checked')?.value || 'upcoming';
    const typeLabel = type === 'upcoming' ? 'Upcoming Meeting' : 'Past Meeting';
    
    if (selectedFollowUpMeetings.length === 0) {
        previewContent.innerHTML = `
            <strong>Type:</strong> ${typeLabel}<br>
            <br>
            <small style="color: var(--text-secondary);">Select meetings from Step 2 to continue</small>
        `;
        return;
    }
    
    const meetings = selectedFollowUpMeetings.map(id => state.meetings.find(m => m.id === id));
    const customerName = meetings[0].customerName;
    
    // Count unique tags
    const allTags = meetings.flatMap(m => m.tags || []);
    const uniqueTags = [...new Set(allTags)];
    
    // Count next steps
    const allNextSteps = meetings.filter(m => {
        const nextSteps = m.nextStepsHTML ? htmlToPlainText(m.nextStepsHTML) : m.nextSteps || '';
        return nextSteps.trim();
    });
    
    previewContent.innerHTML = `
        <strong>Customer:</strong> ${escapeHtml(customerName)}<br>
        <strong>Type:</strong> ${typeLabel}<br>
        <strong>Combining data from:</strong> ${meetings.length} meeting${meetings.length > 1 ? 's' : ''}<br>
        <br>
        <strong>Will Include:</strong><br>
        • Combined notes from ${meetings.length} meeting${meetings.length > 1 ? 's' : ''}<br>
        ${allNextSteps.length > 0 ? `• Next steps from ${allNextSteps.length} meeting${allNextSteps.length > 1 ? 's' : ''}<br>` : ''}
        • ${followUpParticipants.length} selected participant${followUpParticipants.length !== 1 ? 's' : ''}<br>
        ${uniqueTags.length > 0 ? `• ${uniqueTags.length + 1} tags (including "follow-up")<br>` : '• 1 tag ("follow-up")<br>'}
        <br>
        <small style="color: var(--text-secondary);"><span class="icon icon-lightbulb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg></span> You can edit all details after creation</small>
    `;
}


function createFollowUpMeeting() {
    if (!validateFollowUpSelection()) return;
    
    const meetings = selectedFollowUpMeetings.map(id => state.meetings.find(m => m.id === id));
    const type = document.querySelector('input[name="followUpType"]:checked').value;
    const isPastMeeting = type === 'past';
    const dateInput = isPastMeeting ? 
        document.getElementById('followUpDatePast').value : 
        document.getElementById('followUpDateUpcoming').value;
    
    // Get customer info
    const customerId = meetings[0].customerId;
    const customerName = meetings[0].customerName;
    
   // Get the date for the new follow-up meeting
const followUpDate = new Date(dateInput);
const followUpDateStr = followUpDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format

// Get original title for the header
const originalTitle = meetings.length === 1 
    ? meetings[0].title 
    : meetings[0].title; // Use first meeting's title even for multiple

// Create header for the NEW follow-up meeting at the top
let combinedNotes = `<h3 style="color:#107580; margin: 0 0 0.5rem 0;">═══ Follow-Up: ${escapeHtml(originalTitle)} (${followUpDateStr}) ═══</h3>`;


combinedNotes += '<p><br></p>'; // Space for user to type new notes
combinedNotes += '<br><br>'; // 2 blank lines before previous meeting notes

// Combine notes from selected meetings with separators
meetings.forEach(meeting => {
    const notesText = meeting.notesHTML || meeting.notes || '';
    if (notesText.trim()) {
        const meetingDate = new Date(meeting.date).toLocaleDateString('en-GB'); // DD/MM/YYYY format
        combinedNotes += `<h3>═══ Subject: ${escapeHtml(meeting.title)} (${meetingDate}) ═══</h3>`;
        combinedNotes += notesText;
        combinedNotes += '<br><br>';
    }
});
    
// Combine next steps
let combinedNextSteps = '';
meetings.forEach(meeting => {
    const nextStepsText = meeting.nextStepsHTML || meeting.nextSteps || '';
    if (nextStepsText.trim()) {
        const meetingDate = new Date(meeting.date).toLocaleDateString('en-GB'); // DD/MM/YYYY format
        combinedNextSteps += `<h3>═══ Subject: ${escapeHtml(meeting.title)} (${meetingDate}) ═══</h3>`;
        combinedNextSteps += nextStepsText;
        combinedNextSteps += '<br><br>';
    }
});
    
    // Use selected participants (not automatic merge)
    const selectedParticipants = [...followUpParticipants];
    
    // Merge tags (remove duplicates, add "follow-up")
    const allTags = meetings.flatMap(m => m.tags || []);
    const uniqueTags = [...new Set(allTags)];
    if (!uniqueTags.includes('follow-up')) {
        uniqueTags.push('follow-up');
    }
    
    // Close modal
    closeFollowUpModal();
    
    // Set up state for follow-up meeting
    state.editingMeeting = null;
    state.meetingTasks = [];
    state.meetingParticipants = selectedParticipants;
    state.selectedCustomerId = customerId;
    state.meetingIsPastMeeting = isPastMeeting;
    
    // Open meeting form
    hideUpcomingMeetings();
    hideCustomerParticipantsSection();
    document.getElementById('inlineCustomerInfoForm').classList.remove('active');

    document.getElementById('customerCustomerInfosSection').classList.remove('active');
    document.getElementById('customerMeetingsSection').classList.remove('active');
    document.querySelector('.tasks-section').style.display = 'none';
    document.getElementById('notesContainer').classList.add('hidden');
    document.getElementById('mainContainer').classList.add('form-mode');
    
    // Set title
    const titleElement = document.getElementById('meetingFormTitle');
    if (titleElement) {
        if (meetings.length === 1) {
            titleElement.textContent = `+ Follow-Up from "${meetings[0].title}"`;
        } else {
            titleElement.textContent = `+ Follow-Up from ${meetings.length} Meetings`;
        }
    }
    
    // Pre-fill form with combined data
    document.getElementById('meetingForm').reset();
    document.getElementById('meetingId').value = '';
    document.getElementById('meetingTitle').value = `Follow-Up: ${originalTitle}`;
    document.getElementById('meetingDate').value = dateInput;
    document.getElementById('meetingCustomerInput').value = customerName;
    document.getElementById('meetingTags').value = uniqueTags.join(', ');
    
    // Set notes
    setEditorHTML('meetingNotesEditor', combinedNotes);
    
    // Set next steps
    setEditorHTML('meetingNextStepsEditor', combinedNextSteps);
    
    // Render participants list
    renderParticipantsList();
    
    // Load customer info
    loadCustomerInfoForCustomer(customerId);
    
    // Show the form
    document.getElementById('inlineMeetingForm').classList.add('active');
    
    // Reset tabs to Info tab
    document.querySelectorAll('#inlineMeetingForm .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#inlineMeetingForm .tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('#inlineMeetingForm .modal-tab[data-tab="info"]').classList.add('active');
    document.querySelector('#inlineMeetingForm [data-tab-content="info"]').classList.add('active');
    
    showToast(`<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Follow-up created from ${meetings.length} meeting${meetings.length > 1 ? 's' : ''}!`, 'success');
    window.scrollTo(0, 0);
}

// ========== SHARING FEATURE FUNCTIONS - START ==========



// Initialize sharing data
async function loadSharingData() {
    if (!auth.currentUser) {
        state.sharedMeetings = [];
        state.myShares = [];
        updateShareNotificationBadge();
        return;
    }
    
    try {
        // Load meetings shared WITH me
        const sharedWithMe = await db.collection('sharedMeetings')
            .where('sharedWithEmail', '==', auth.currentUser.email.toLowerCase())
            .get();
        
        state.sharedMeetings = sharedWithMe.docs.map(doc => doc.data());
        
        // Load meetings shared BY me
        const sharedByMe = await db.collection('sharedMeetings')
            .where('sharedBy', '==', auth.currentUser.uid)
            .get();
        
        state.myShares = sharedByMe.docs.map(doc => doc.data());
        
        updateShareNotificationBadge();
    } catch (error) {
        console.error('Error loading shares:', error);
    }
}


function saveSharingData() {
    updateShareNotificationBadge();
}

function updateShareNotificationBadge() {
    const badge = document.getElementById('sharedNotificationBadge');
    const pendingCount = state.sharedMeetings.filter(s => s.status === 'pending').length;
    
    if (pendingCount > 0) {
        badge.textContent = pendingCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function updateSharedBadge() {
    updateShareNotificationBadge();
}


// Open share modal
let currentSharingMeetingId = null;

function openShareModal(meetingId) {
 // Reset any previous state first
    currentSharingMeetingId = null;
    
 // Make sure modal is fully closed before reopening
    const modal = document.getElementById('shareModal');
    modal.classList.remove('active');
    
 // Small delay to ensure clean state
    setTimeout(() => {
        currentSharingMeetingId = meetingId;
        const meeting = state.meetings.find(m => m.id === meetingId);
        
        if (!meeting) {
            console.error('Meeting not found:', meetingId);
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Meeting not found', 'error');
            return;
        }
        
        document.getElementById('shareModalTitle').innerHTML = `<span class="icon icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span> Share "${meeting.title}"`;
        document.getElementById('shareModalMeetingId').value = meetingId;
        document.getElementById('shareEmailInput').value = '';
        document.getElementById('shareMessageInput').value = '';
        document.getElementById('shareNotifyEmail').checked = true;
        
        // Reset tab checkboxes to default (info and notes)
        document.querySelectorAll('input[name="shareTab"]').forEach(cb => {
            cb.checked = (cb.value === 'info' || cb.value === 'notes');
        });
        
        // Switch to first tab
        document.querySelectorAll('.share-modal-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.share-tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector('.share-modal-tab[data-share-tab="new"]').classList.add('active');
        document.querySelector('.share-tab-content[data-share-tab-content="new"]').classList.add('active');
        
        // Render shared with list
        renderSharedWithList(meetingId);
        
        // Setup link sharing
        setupLinkSharing(meetingId);
        
 // Force modal to be visible
        modal.style.display = 'flex';
        modal.classList.add('active');
        
        console.log('Share modal opened for meeting:', meetingId); // Debug log
    }, 50);
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    currentSharingMeetingId = null;
}

// Setup share modal tabs
function setupShareModalTabs() {
    document.querySelectorAll('.share-modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.shareTab;
            
            document.querySelectorAll('.share-modal-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.share-tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.querySelector(`.share-tab-content[data-share-tab-content="${tabName}"]`).classList.add('active');
        });
    });
}

// Send share invite
async function sendShareInvite() {
    const meetingId = document.getElementById('shareModalMeetingId').value;
    const email = document.getElementById('shareEmailInput').value.trim().toLowerCase();
    const selectedTabs = Array.from(document.querySelectorAll('input[name="shareTab"]:checked')).map(cb => cb.value);
    const message = document.getElementById('shareMessageInput').value.trim();
    const notifyByEmail = document.getElementById('shareNotifyEmail').checked;
    
    if (!auth.currentUser) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Sign in to share meetings', 'error');
        return;
    }
    
    if (selectedTabs.length === 0) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Select at least one tab to share', 'error');
        return;
    }
    
    if (!email || !email.includes('@')) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter valid email', 'error');
        return;
    }
    
    if (email === auth.currentUser.email.toLowerCase()) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Cannot share with yourself', 'error');
        return;
    }
    
    const meeting = state.meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    // Check if already shared
    if (state.myShares.some(s => s.meetingId === meetingId && s.sharedWithEmail === email)) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Already shared with this user', 'error');
        return;
    }
    
    try {
        // Build shared data based on selected tabs
        const sharedData = {
            id: meeting.id,
            customerName: meeting.customerName,
            title: meeting.title,
            date: meeting.date,
            type: meeting.type,
            duration: meeting.duration
        };
        
        if (selectedTabs.includes('info')) {
            sharedData.participants = meeting.participants;
            sharedData.tags = meeting.tags;
        }
        if (selectedTabs.includes('notes')) {
            sharedData.notes = meeting.notes;
            sharedData.notesHTML = meeting.notesHTML;
            sharedData.nextSteps = meeting.nextSteps;
            sharedData.nextStepsHTML = meeting.nextStepsHTML;
        }
        if (selectedTabs.includes('meddpicc')) {
            sharedData.meddpicc = meeting.meddpicc;
        }
        if (selectedTabs.includes('actions')) {
            sharedData.associatedTasks = state.tasks.filter(t => t.meetingId === meetingId).map(t => ({
                title: t.title || '',
                description: t.description || '',
                priority: t.priority || 'medium',
                status: t.status || 'todo',
                dueDate: t.dueDate || '',
                tags: Array.isArray(t.tags) ? [...t.tags] : [],
                subtasks: Array.isArray(t.subtasks) ? [...t.subtasks] : [],
                color: t.color || 'none',
                completed: t.completed || false
            }));
        }
        
        const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const shareRecord = {
            id: shareId,
            meetingId: meetingId,
            meetingTitle: meeting.title,
            meetingData: sharedData,
            sharedBy: auth.currentUser.uid,
            sharedByEmail: auth.currentUser.email,
            sharedByName: auth.currentUser.displayName || auth.currentUser.email,
            sharedWithEmail: email,
            sharedTabs: selectedTabs,
            message: message,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
                // Save to Firestore shared collection
        await db.collection('sharedMeetings').doc(shareId).set(shareRecord);
        
        // Send email notification if enabled
        if (notifyByEmail) {
            try {
                await db.collection('mail').add({
                    to: email,
                    template: {
                        name: 'shareNotification',
                        data: {
                            senderName: auth.currentUser.displayName || auth.currentUser.email,
                            senderEmail: auth.currentUser.email,
                            meetingTitle: meeting.title,
                            meetingDate: new Date(meeting.date).toLocaleDateString(),
                            customerName: meeting.customerName || '',
                            message: message,
                            sharedTabs: selectedTabs.join(', '),
                            appUrl: window.location.origin
                        }
                    }
                });
            } catch (emailError) {
                console.warn('Email notification failed:', emailError);
            }
        }
        
        // Update local state
        state.myShares.push(shareRecord);
        saveData();
        
        renderSharedWithList(meetingId);
        document.getElementById('shareEmailInput').value = '';
        document.getElementById('shareMessageInput').value = '';
        
        // Show success window (this also closes the share modal)
        showShareSuccess(email);
        
    } catch (error) {
        console.error('Share error:', error);
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed to share: ' + error.message, 'error');
    }
}


// Render shared with list
function renderSharedWithList(meetingId) {
    const container = document.getElementById('sharedWithList');
    const shares = state.myShares.filter(s => s.meetingId === meetingId);
    
    if (shares.length === 0) {
        container.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.85rem;">Not shared yet</div>';
        return;
    }
    
    container.innerHTML = shares.map(share => {
        const email = share.sharedWithEmail || 'Unknown';
        const initial = email[0].toUpperCase();
        const statusColor = share.status === 'accepted' ? '#10b981' : share.status === 'declined' ? '#ef4444' : '#f59e0b';
        const statusText = share.status === 'accepted' ? 'Accepted' : share.status === 'declined' ? 'Declined' : 'Pending';
        
        return `
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: var(--bg-primary); border-radius: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.8rem;">${initial}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${email}</div>
                    <div style="font-size: 0.75rem; color: ${statusColor};">${statusText}</div>
                </div>
            </div>
        `;
    }).join('');
}


// Remind share
function remindShare(shareId) {
    // In real implementation, this would send an email
    showToast('<span class="icon icon-mail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span> Reminder sent!', 'success');
}

// Link sharing functions
function setupLinkSharing(meetingId) {
    const linkEnabled = state.myShares.some(s => s.meetingId === meetingId && s.isPublicLink);
    document.getElementById('linkSharingEnabled').checked = linkEnabled;
    
    if (linkEnabled) {
        const linkShare = state.myShares.find(s => s.meetingId === meetingId && s.isPublicLink);
        document.getElementById('shareLinkUrl').value = `https://cnotes.app/m/${meetingId}`;
        document.getElementById('linkPermissionLevel').value = linkShare.permission;
        document.getElementById('linkExpiration').value = linkShare.expiration || 'never';
        document.getElementById('linkSharingOptions').style.display = 'block';
    } else {
        document.getElementById('linkSharingOptions').style.display = 'none';
    }
}

function toggleLinkSharing() {
    const enabled = document.getElementById('linkSharingEnabled').checked;
    const meetingId = currentSharingMeetingId;
    
    if (enabled) {
        // Create public link share
        const linkShare = {
            id: `link_${Date.now()}`,
            meetingId: meetingId,
            isPublicLink: true,
            permission: 'view',
            expiration: 'never',
            createdAt: new Date().toISOString()
        };
        
        state.myShares.push(linkShare);
        document.getElementById('shareLinkUrl').value = `https://cnotes.app/m/${meetingId}`;
        document.getElementById('linkSharingOptions').style.display = 'block';
        
        showToast('<span class="icon icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span> Link sharing enabled', 'success');
    } else {
        // Remove public link share
        state.myShares = state.myShares.filter(s => !(s.meetingId === meetingId && s.isPublicLink));
        document.getElementById('linkSharingOptions').style.display = 'none';
        
        showToast('<span class="icon icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span> Link sharing disabled', 'success');
    }
    
    saveSharingData();
}

function copyShareLink() {
    const linkUrl = document.getElementById('shareLinkUrl').value;
    navigator.clipboard.writeText(linkUrl).then(() => {
        showToast('<span class="icon icon-link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span> Link copied!', 'success');
    });
}

function showSharedMeetings() {
    state.currentCustomer = 'all';
    document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
    
    // Hide other sections
    document.getElementById('inlineMeetingForm').classList.remove('active');
    document.getElementById('inlineCustomerInfoForm').classList.remove('active');

    document.getElementById('customerCustomerInfosSection').classList.remove('active');
    document.getElementById('customerMeetingsSection').classList.remove('active');
    hideCustomerParticipantsSection();
    hideUpcomingMeetings();
    hideCustomerActivity();
    hideAllCustomersSection();
    
    // Hide tasks and notes
    document.querySelector('.tasks-section').style.display = 'none';
    document.getElementById('notesContainer').classList.add('hidden');
    
    // Show shared section
    document.getElementById('sharedMeetingsSection').classList.add('active');
    
    // Update title
    document.getElementById('mainSectionTitle').textContent = 'Shared Meetings';
    
    // Hide header banner
    document.getElementById('customerHeaderBanner').classList.remove('active');
    
    // Smart default: If there are pending shares WITH me, show those first
    // Otherwise, show all shared meetings
    const pendingWithMe = state.sharedMeetings.filter(sm => sm.status === 'pending').length;
    
    if (pendingWithMe > 0) {
        document.getElementById('sharedViewFilter').value = 'with-me';
    } else {
        document.getElementById('sharedViewFilter').value = 'all';
    }
    
    // Render
    renderSharedMeetings();
}

let currentSharedStatusFilter = 'all';


function showShareSuccess(email) {
    // First close the share modal
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.classList.remove('active');
        shareModal.style.display = 'none';
    }
    currentSharingMeetingId = null;
    
    // Configure the confirm modal as a success message
    document.getElementById('confirmIcon').innerHTML = '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>';
    document.getElementById('confirmTitle').textContent = 'Meeting Shared!';
    document.getElementById('confirmMessage').textContent = `Meeting has been shared with ${email}!`;
    
    // Hide cancel button for this use
    const cancelBtn = document.getElementById('cancelConfirmBtn');
    cancelBtn.style.display = 'none';
    
    // Configure OK button
    const confirmBtn = document.getElementById('confirmBtn');
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.textContent = 'OK';
    newConfirmBtn.className = 'btn btn-primary';
    
    newConfirmBtn.addEventListener('click', () => {
        document.getElementById('confirmModal').classList.remove('active');
        // Restore cancel button for future confirms
        document.getElementById('cancelConfirmBtn').style.display = '';
        // Reset confirm button styling
        const btn = document.getElementById('confirmBtn');
        btn.textContent = 'Confirm';
        btn.className = 'btn btn-danger';
    });
    
    state.confirmCallback = null;
    document.getElementById('confirmModal').classList.add('active');
}

function filterSharedByStatus(status) {
    currentSharedStatusFilter = status;
    
    document.querySelectorAll('.shared-status-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.shared-status-btn[data-status="${status}"]`).classList.add('active');
    
    renderSharedMeetings();
}

function renderSharedMeetings() {
    const container = document.getElementById('sharedMeetingsGrid');
    const empty = document.getElementById('sharedMeetingsEmpty');
    const viewFilter = document.getElementById('sharedViewFilter').value;
    const searchQuery = document.getElementById('sharedSearchInput').value.toLowerCase();
    
    let meetings = [];
    
    // Filter by view type
    if (viewFilter === 'with-me') {
        meetings = state.sharedMeetings.map(sm => ({
            ...sm,
            viewType: 'with-me'
        }));
    } else if (viewFilter === 'by-me') {
        meetings = state.myShares
            .filter(s => !s.isPublicLink)
            .map(share => {
                const meeting = state.meetings.find(m => m.id === share.meetingId);
                return {
                    ...share,
                    meetingData: meeting,
                    viewType: 'by-me'
                };
            });
    } else {
        // All
        const withMe = state.sharedMeetings.map(sm => ({
            ...sm,
            viewType: 'with-me'
        }));
        const byMe = state.myShares
            .filter(s => !s.isPublicLink)
            .map(share => {
                const meeting = state.meetings.find(m => m.id === share.meetingId);
                return {
                    ...share,
                    meetingData: meeting,
                    viewType: 'by-me'
                };
            });
        meetings = [...withMe, ...byMe];
    }
    
    // Filter by status
    if (currentSharedStatusFilter !== 'all') {
        meetings = meetings.filter(m => m.status === currentSharedStatusFilter);
    }
    
    // Filter by search
    if (searchQuery) {
        meetings = meetings.filter(m => {
            const title = m.meetingData?.title || m.meetingTitle || '';
            const customer = m.meetingData?.customerName || '';
            return title.toLowerCase().includes(searchQuery) || 
                   customer.toLowerCase().includes(searchQuery);
        });
    }
    
    // Sort by date (newest first)
    meetings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (meetings.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    
    empty.style.display = 'none';
    
    container.innerHTML = meetings.map(item => {
        const meeting = item.meetingData || item;
        const title = meeting.title || item.meetingTitle;
        const customerName = meeting.customerName || '';
        const meetingDate = meeting.date ? new Date(meeting.date).toLocaleDateString() : '';
        
                const notesText = meeting.notesHTML ? htmlToPlainText(meeting.notesHTML) : meeting.notes || '';
        const isLongNotes = notesText.length > 120 || notesText.split('\n').length > 2;
        
       // Inside renderSharedMeetings() function
if (item.viewType === 'with-me') {
    // Shared WITH me
    
    // Count tasks if they exist
    const taskCount = item.meetingData.associatedTasks ? item.meetingData.associatedTasks.length : 0;
    
    return `
        <div class="shared-meeting-card ${item.status}">
            <div class="shared-card-header">
                <span class="shared-card-badge ${item.status === 'pending' ? 'new' : 'accepted'}">
                    ${item.status === 'pending' ? '<span class="icon icon-circle-blue"><svg viewBox="0 0 24 24" fill="#3b82f6" stroke="none"><circle cx="12" cy="12" r="6"/></svg></span> NEW' : '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> ACCEPTED'}
                </span>
            </div>
            <div class="shared-card-title">${escapeHtml(title)}${customerName ? ` - ${escapeHtml(customerName)}` : ''}</div>
            <div class="shared-card-meta">
                <span class="shared-card-meta-item">
                    <span><span class="icon icon-user"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></span>
                    <span>Shared by: ${escapeHtml(item.sharedByName)}</span>
                </span>
${meetingDate ? `
    <span class="shared-card-meta-item">
        <span>${getCalendarSVG(14)}</span>
        <span>${meetingDate}</span>
    </span>
` : ''}
                <span class="shared-card-meta-item">
                    <span><span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span></span>
                    <span>${item.sharedTabs ? item.sharedTabs.join(', ') : 'All tabs'}</span>
                </span>
                ${taskCount > 0 ? `
                    <span class="shared-card-meta-item">
                        <span><span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span></span>
                        <span>${taskCount} task${taskCount !== 1 ? 's' : ''} included</span>
                    </span>
                ` : ''}
            </div>
                       ${notesText ? `
                <div class="shared-card-preview" style="margin-bottom: 0.5rem;">
                    <strong><span class="icon icon-edit-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span> Notes Preview:</strong><br>
                    <div class="meeting-summary-notes-content" id="shared-notes-${item.id}" style="max-height: 50px; overflow: hidden; margin-top: 0.5rem;">${escapeHtml(notesText)}</div>
                    ${isLongNotes ? `
                        <button class="meeting-summary-notes-toggle" onclick="event.stopPropagation(); toggleSharedNotesExpand('shared-notes-${item.id}', this)" style="margin-top: 0.5rem;">
                            Show More ▼
                        </button>
                    ` : ''}
                </div>
            ` : ''}
            
            <!-- THIS IS THE GREEN BACKGROUND SECTION -->
            ${taskCount > 0 ? `
                <div class="shared-card-preview" style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; margin-top: 0.5rem;">
                    <span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> <strong>Tasks Preview:</strong><br>
                    ${item.meetingData.associatedTasks.slice(0, 3).map(t => 
                        `• ${escapeHtml(t.title)}`
                    ).join('<br>')}
                    ${taskCount > 3 ? `<br>• ... and ${taskCount - 3} more` : ''}
                </div>
            ` : ''}
            
            <div class="shared-card-actions">
                ${item.status === 'pending' ? `
                    <button class="shared-action-btn primary" onclick="openAcceptMeetingModal('${item.id}')">
                        <span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Accept & Add
                    </button>
                    <button class="shared-action-btn secondary" onclick="viewSharedMeeting('${item.id}')">
    <span class="icon icon-pencil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></span> Preview & Edit
</button>
                    <button class="shared-action-btn danger" onclick="declineSharedMeeting('${item.id}')">
                        <span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Decline
                    </button>
                               ` : `
                    <button class="shared-action-btn primary" onclick="openSharedMeeting('${item.id}')">
                        <span class="icon icon-book"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span> Open Meeting
                    </button>
                `}
            </div>
        </div>
    `;
} else {
    // Shared BY me
    const allSharesForMeeting = state.myShares.filter(s => s.meetingId === item.meetingId && !s.isPublicLink);
    const shareCount = allSharesForMeeting.length;
    const sharedDate = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `
        <div class="shared-meeting-card shared-by-me">
            <div class="shared-card-header">
                <span class="shared-card-badge shared"><span class="icon icon-upload"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></span> SHARED BY YOU</span>
            </div>
            <div class="shared-card-title">${escapeHtml(title)}${customerName ? ` - ${escapeHtml(customerName)}` : ''}</div>
            <div class="shared-card-meta">
                ${meetingDate ? `
                    <span class="shared-card-meta-item">
                        <span><span class="icon icon-calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span></span>
                        <span>Meeting: ${meetingDate}</span>
                    </span>
                ` : ''}
                <span class="shared-card-meta-item">
                    <span><span class="icon icon-upload"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></span></span>
                    <span>Shared: ${sharedDate}</span>
                </span>
                <span class="shared-card-meta-item">
                    <span><span class="icon icon-users"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span></span>
                    <span>With ${shareCount} ${shareCount === 1 ? 'person' : 'people'}</span>
                </span>
            </div>
            
            <!-- List of people shared with -->
            <div style="background: var(--bg-tertiary); padding: 0.75rem; border-radius: 6px; margin-top: 0.75rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.5rem;">
                    <span class="icon icon-clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> Shared With:
                </div>
                ${allSharesForMeeting.map(share => `
<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px; margin-bottom: 0.35rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>${share.sharedWithName.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
        <div>
            <div style="font-weight: 600; font-size: 0.85rem;">${escapeHtml(share.sharedWithName)}</div>
            <div style="font-size: 0.7rem; color: var(--text-secondary);">${escapeHtml(share.sharedWithEmail)}</div>
        </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="shared-status-badge ${share.status}">
            ${share.status === 'pending' ? '<span class="icon icon-hourglass"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg></span> Pending' : '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Accepted'}
        </span>
    </div>
</div>
                `).join('')}
            </div>
            
            <div class="shared-card-actions">
                <button class="shared-action-btn primary" onclick="openShareModal('${item.meetingId}')">
                    + Share with More
                </button>
                <button class="shared-action-btn secondary" onclick="editMeeting('${item.meetingId}')">
                    <span class="icon icon-pencil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></span> Edit Meeting
                </button>
            </div>
        </div>
    `;
}    }).join('');
}

// Accept meeting modal
function openAcceptMeetingModal(sharedMeetingId) {
    const sharedMeeting = state.sharedMeetings.find(sm => sm.id === sharedMeetingId);
    if (!sharedMeeting) return;
    
    // Close the editing form if it's open
    if (document.getElementById('inlineMeetingForm').classList.contains('active')) {
        closeInlineMeetingForm();
    }
    
    document.getElementById('acceptMeetingId').value = sharedMeetingId;
    
    // Reset customer input
    document.getElementById('acceptMeetingCustomerInput').value = '';
    document.getElementById('acceptMeetingCustomer').value = '';
    updateAcceptCustomerDropdown('');    
    // Populate tab dropdown
    const tabSelect = document.getElementById('acceptMeetingTab');
    tabSelect.innerHTML = '<option value="all">All Meetings</option><option value="individual">Individual</option>';
    state.meetingTabs.forEach(tab => {
        if (!tab.isDefault) {
            const option = document.createElement('option');
            option.value = tab.id;
            option.textContent = tab.name;
            tabSelect.appendChild(option);
        }
    });
    
    document.getElementById('acceptMeetingModal').classList.add('active');
}


function toggleSharedNotesExpand(elementId, buttonElement) {
    const content = document.getElementById(elementId);
    
    if (!content || !buttonElement) return;
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        content.style.maxHeight = '50px';
        buttonElement.textContent = 'Show More ▼';
    } else {
        content.classList.add('expanded');
        content.style.maxHeight = '500px';
        buttonElement.textContent = 'Show Less ▲';
    }
}


function closeAcceptMeetingModal() {
    document.getElementById('acceptMeetingModal').classList.remove('active');
}

async function acceptSharedMeeting() {
    const sharedMeetingId = document.getElementById('acceptMeetingId').value;
    let customerId = document.getElementById('acceptMeetingCustomer').value;
    const customerInputValue = document.getElementById('acceptMeetingCustomerInput').value.trim();
    const tabId = document.getElementById('acceptMeetingTab').value;
    
    if (!customerId && !customerInputValue) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter a customer name', 'error');
        return;
    }
    
    const sharedMeeting = state.sharedMeetings.find(sm => sm.id === sharedMeetingId);
    if (!sharedMeeting) return;
    
    let customer = state.customers.find(c => c.id === customerId);
    
    if (!customer && customerInputValue) {
        customer = {
            id: Date.now().toString(),
            name: customerInputValue,
            createdAt: new Date().toISOString()
        };
        state.customers.push(customer);
        customerId = customer.id;
    }
    
    try {
        // Update status in Firestore
        await db.collection('sharedMeetings').doc(sharedMeetingId).update({
            status: 'accepted',
            acceptedAt: new Date().toISOString()
        });
        
        // Update local state
        sharedMeeting.status = 'accepted';
        
        // Create local copy of meeting
        const newMeeting = {
            ...sharedMeeting.meetingData,
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            customerId: customerId,
            customerName: customer.name,
            tabId: tabId,
            originalSharedFrom: sharedMeetingId,
isPastMeeting: true,
            createdAt: new Date().toISOString()
        };
        
        state.meetings.unshift(newMeeting);
        
                // Create tasks if included
        if (sharedMeeting.meetingData.associatedTasks && Array.isArray(sharedMeeting.meetingData.associatedTasks)) {
            sharedMeeting.meetingData.associatedTasks.forEach((t, index) => {
                // Small delay to ensure unique IDs
                const uniqueId = `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;
                
                state.tasks.unshift({
                    id: uniqueId,
                    title: t.title || 'Untitled Task',
                    description: t.description || '',
                    priority: t.priority || 'medium',
                    status: t.status || 'todo',
                    dueDate: t.dueDate || '',
                    tags: Array.isArray(t.tags) ? t.tags : [],
                    color: t.color || 'none',
                    subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
                    completed: t.completed || false,
                    archived: false,
                    customerId: customerId,
                    customerName: customer.name,
                    meetingId: newMeeting.id,
                    createdAt: new Date().toISOString()
                });
            });
        }
        
                saveData();
        renderCustomerFilters();
        closeAcceptMeetingModal();
        
        // Update the notification badge since pending count changed
        updateShareNotificationBadge();
        
        selectCustomerFromOverview(customerId);
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Meeting added!', 'success');
        
    } catch (error) {
        console.error('Accept error:', error);
        showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed: ' + error.message, 'error');
    }
}


function updateAcceptCustomerDropdown(searchTerm = '') {
    const dropdown = document.getElementById('acceptCustomerDropdown');
    const filteredCustomers = state.customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    let html = '';
    
    if (searchTerm && !filteredCustomers.some(c => c.name.toLowerCase() === searchTerm.toLowerCase())) {
        html += `<div class="customer-dropdown-item new-customer" onclick="selectNewAcceptCustomer('${escapeHtml(searchTerm)}')">
            <span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span> Add "${escapeHtml(searchTerm)}"
        </div>`;
    }
    
    filteredCustomers.forEach(customer => {
        html += `
            <div class="customer-dropdown-item" onclick="selectExistingAcceptCustomer('${customer.id}')">
                <div class="customer-dropdown-item-name">${escapeHtml(customer.name)}</div>
                ${customer.email ? `<div class="customer-dropdown-item-email">${escapeHtml(customer.email)}</div>` : ''}
            </div>
        `;
    });
    
    if (filteredCustomers.length === 0 && !searchTerm) {
        html = '<div class="customer-dropdown-item" style="text-align: center; color: var(--text-secondary); font-size: 0.75rem;">No customers</div>';
    }
    
    dropdown.innerHTML = html;
}

function selectExistingAcceptCustomer(customerId) {
    const customer = state.customers.find(c => c.id === customerId);
    if (customer) {
        document.getElementById('acceptMeetingCustomerInput').value = customer.name;
        document.getElementById('acceptMeetingCustomer').value = customerId;
        document.getElementById('acceptCustomerDropdown').classList.remove('active');
    }
}

function selectNewAcceptCustomer(customerName) {
    document.getElementById('acceptMeetingCustomerInput').value = customerName;
    document.getElementById('acceptMeetingCustomer').value = ''; // Empty = will create new
    document.getElementById('acceptCustomerDropdown').classList.remove('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#acceptMeetingCustomerInput') && 
        !e.target.closest('#acceptCustomerDropdown')) {
        document.getElementById('acceptCustomerDropdown')?.classList.remove('active');
    }
});

function declineSharedMeeting(sharedMeetingId) {
    showConfirm('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>', 'Decline?', 'Decline this shared meeting?', async () => {
        try {
            await db.collection('sharedMeetings').doc(sharedMeetingId).delete();
            state.sharedMeetings = state.sharedMeetings.filter(sm => sm.id !== sharedMeetingId);
            renderSharedMeetings();
            updateShareNotificationBadge();
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Declined', 'success');
        } catch (error) {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Failed: ' + error.message, 'error');
        }
    });
}

function viewSharedMeeting(sharedMeetingId) {
    const sharedMeeting = state.sharedMeetings.find(sm => sm.id === sharedMeetingId);
    if (!sharedMeeting) return;
    
    // Store which shared meeting we're editing
    editingSharedMeetingId = sharedMeetingId;
    
    // Populate state.meetingTasks from shared data BEFORE opening form
    if (sharedMeeting.meetingData.associatedTasks && sharedMeeting.meetingData.associatedTasks.length > 0) {
        state.meetingTasks = sharedMeeting.meetingData.associatedTasks.map(t => t.title);
    } else {
        state.meetingTasks = [];
    }
    
 // Pass true as third parameter to preserve shared data
    openInlineMeetingForm(sharedMeeting.meetingData, true, true);  
    
    // Hide shared meetings section
    document.getElementById('sharedMeetingsSection')?.classList.remove('active');
}


function openSharedMeeting(sharedMeetingId) {
    const sharedMeeting = state.sharedMeetings.find(sm => sm.id === sharedMeetingId);
    if (!sharedMeeting) return;
    
    if (sharedMeeting.status === 'accepted') {
        // Find the actual meeting that was created from this share
        const actualMeeting = state.meetings.find(m => m.originalSharedFrom === sharedMeetingId);
        
        if (actualMeeting) {
            // Open the REAL meeting (which has the tasks linked to it)
            openInlineMeetingForm(actualMeeting);
            
            // Close shared meetings section
            document.getElementById('sharedMeetingsSection').classList.remove('active');
            
            return;
        }
    }
    
    // Fallback to preview mode for pending/unaccepted meetings
    viewSharedMeeting(sharedMeetingId);
}

// ========== SHARING FEATURE FUNCTIONS - END ==========

// ========== AI ASSISTANT FUNCTIONS - START ==========

// DELETE THIS SECTION WHEN SWITCHING TO FIREBASE 

// ========== LOCAL TESTING ONLY - START ==========
const GEMINI_API_KEY = 'AIzaSyBSLmfwUtcMpioSUGZgtLljxjY1yfS6u4c';

async function callGeminiAPI(prompt) {
    try {
 // Call Gemini API directly (CORS is supported for API key auth)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                }
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            throw new Error(`API returned ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('No response from AI');
        }
        
        console.log('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> AI response received');
        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> AI Error:', error);
        throw new Error(`AI service unavailable: ${error.message}`);
    }
}
// ========== LOCAL TESTING ONLY - END ==========
// DELETE ABOVE SECTION WHEN SWITCHING TO FIREBASE 


// KEEP EVERYTHING BELOW - Works for both local and Firebase 




async function aiImproveText(editorId) {
    const editor = document.getElementById(editorId);
    const currentText = editor.innerText.trim();
    
 // Validation
    if (!currentText) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Write some text first', 'error');
        return;
    }
    
    if (currentText.length < 10) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Text too short to improve (min 10 characters)', 'error');
        return;
    }
    
    if (currentText.length > 5000) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Text too long (max 5000 characters). Try improving sections separately.', 'error');
        return;
    }
    
 // Save original for undo
    const originalHTML = editor.innerHTML;
    
 // Show loading state
    editor.classList.add('editor-loading');
    editor.contentEditable = false;
    
    try {
        const fieldType = editorId === 'meetingNotesEditor' ? 'notes' : 'nextSteps';
        
 // Different prompts for notes vs next steps
        const prompts = {
            notes: `You are a professional sales assistant. Improve these meeting notes by:

1. Fix any grammar, spelling, or punctuation errors
2. Organize into clear sections with headers (use ### for headers)
3. Make the language more professional and concise
4. Highlight key decisions, concerns, and commitments in bold
5. Keep ALL important information - don't remove anything
6. Add relevant emojis to section headers (e.g., <span class="icon icon-message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span> Discussion, <span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Decisions, <span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Concerns)

Return the improved notes in markdown format.

Meeting Notes:
${currentText}`,
            
            nextSteps: `You are a professional sales assistant. Improve these next steps by:

1. Fix grammar and make language clear and actionable
2. Ensure each item starts with a strong action verb (e.g., "Send", "Schedule", "Follow up", "Prepare")
3. Add specific details where appropriate (e.g., "by Friday", "with VP of Sales")
4. Organize by priority (most urgent first)
5. Keep ALL items - don't remove anything
6. Format as a clear bulleted or numbered list

Return as an organized action list.

Next Steps:
${currentText}`
        };
        
        const prompt = prompts[fieldType];
        
 // REPLACE THIS BLOCK WHEN SWITCHING TO FIREBASE 
        // ========== LOCAL VERSION - START ==========
        const improvedText = await callGeminiAPI(prompt);
        // ========== LOCAL VERSION - END ==========
        
        /* ========== FIREBASE VERSION (COMMENTED OUT FOR NOW) - START ==========
 // UNCOMMENT THIS WHEN SWITCHING TO FIREBASE:
        
        // Check authentication
        if (!firebase.auth().currentUser) {
            throw new Error('Please sign in to use AI features');
        }
        
        // Call Firebase Function
        const aiImprove = firebase.functions().httpsCallable('aiImproveText');
        const result = await aiImprove({
            text: currentText,
            fieldType: fieldType
        });
        
        const improvedText = result.data.result;
        const remaining = result.data.remaining;
        
        // Show remaining quota
        if (remaining <= 5) {
            setTimeout(() => {
                showToast(`<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> ${remaining} AI requests left today`, 'warning');
            }, 2000);
        }
        
        ========== FIREBASE VERSION (COMMENTED OUT FOR NOW) - END ========== */
        
 // Convert markdown to HTML (KEEP THIS - works for both)
        let formattedHTML = improvedText
            // Headers
            .replace(/### (.+)/g, '<h3 style="color: var(--primary); margin: 1rem 0 0.5rem 0; font-size: 1rem; font-weight: 700;">$1</h3>')
            .replace(/## (.+)/g, '<h2 style="color: var(--primary); margin: 1.5rem 0 0.75rem 0; font-size: 1.1rem; font-weight: 700;">$1</h2>')
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Bullet points
            .replace(/^- (.+)/gm, '• $1')
            .replace(/^\* (.+)/gm, '• $1')
            // Numbered lists (preserve numbers)
            .replace(/^(\d+)\.\s+(.+)/gm, '<div style="margin-left: 0.5rem; margin-bottom: 0.25rem;"><strong>$1.</strong> $2</div>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            // Line breaks
            .replace(/\n/g, '<br>');
        
        // Wrap in paragraphs if not already
        if (!formattedHTML.startsWith('<h') && !formattedHTML.startsWith('<div')) {
            formattedHTML = '<p>' + formattedHTML + '</p>';
        }
        
 // Add AI badge with undo button (KEEP THIS)
        const finalHTML = `
            <div class="ai-improvement-badge">
                <span style="font-size: 0.85rem; color: #667eea; font-weight: 600;">
                    <span class="icon icon-sparkles"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813L20 10l-6.088 1.187L12 17l-1.912-5.813L4 10l6.088-1.187L12 3z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z"/></svg></span> Improved by AI
                </span>
                <button type="button" onclick="undoAiImprovement('${editorId}', \`${originalHTML.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" 
                        title="Undo AI changes">
                    ↶ Undo
                </button>
            </div>
            ${formattedHTML}
        `;
        
        editor.innerHTML = finalHTML;
        showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Text improved by AI!', 'success');
        
    } catch (error) {
        console.error('AI Error:', error);
        editor.innerHTML = originalHTML;
        
 // Error handling (KEEP THIS)
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Invalid API key. Get one from https://makersuite.google.com/app/apikey', 'error');
        } else if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> Daily quota exceeded. Try again tomorrow! <span class="icon icon-moon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>', 'error');
        } else if (error.message.includes('unauthenticated')) {
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Please sign in to use AI features', 'error');
        } else if (error.message.includes('resource-exhausted')) {
            showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Daily AI limit reached (20/day). Try again tomorrow! <span class="icon icon-moon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>', 'error');
        } else {
            showToast('<span class="icon icon-x-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span> AI failed: ' + error.message, 'error');
        }
    } finally {
        editor.classList.remove('editor-loading');
        editor.contentEditable = true;
    }
}

// KEEP THIS - Works for both local and Firebase
function undoAiImprovement(editorId, originalHTML) {
    const editor = document.getElementById(editorId);
    editor.innerHTML = originalHTML;
    showToast('↶ Reverted to original', 'success');
}

// ========== AI ASSISTANT FUNCTIONS - END ==========


// ========== PHONE CALL FUNCTIONS - START ==========

let callContacts = [];
let callActions = [];
let callSelectedCustomerId = null;

function openPhoneCallModal(customerId = null) {
    callContacts = [];
    callActions = [];
    callSelectedCustomerId = customerId;

    // Reset form
    document.getElementById('phoneCallForm').reset();
    document.getElementById('callId').value = '';
    document.getElementById('callMode').value = 'connected';

    // Set default date to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('callDate').value = now.toISOString().slice(0, 16);

    // Set customer if provided
    if (customerId) {
        const customer = state.customers.find(c => c.id === customerId);
        if (customer) {
            document.getElementById('callCustomerInput').value = customer.name;
            loadCallQuickAddContacts(customerId);
        }
    } else {
        document.getElementById('callCustomerInput').value = '';
        document.getElementById('callQuickAddContacts').style.display = 'none';
    }

    // Reset to connected mode
    setCallMode('connected');

    // Render empty lists
    renderCallContactsList();
    renderCallActionsList();

    // Setup customer combobox
    setupCallCustomerCombobox();

    document.getElementById('phoneCallModal').classList.add('active');
}

function closePhoneCallModal() {
    document.getElementById('phoneCallModal').classList.remove('active');
    callContacts = [];
    callActions = [];
    callSelectedCustomerId = null;
}

function setCallMode(mode) {
    document.getElementById('callMode').value = mode;
    const isConnected = mode === 'connected';

    // Update toggle button styles directly
    const connectedBtn = document.getElementById('callToggleConnected');
    const notConnectedBtn = document.getElementById('callToggleNotConnected');

    if (isConnected) {
        connectedBtn.style.background = 'linear-gradient(135deg, #023747 0%, #1ba8af 100%)';
        connectedBtn.style.color = 'white';
        connectedBtn.style.boxShadow = '0 2px 6px rgba(27,168,175,0.3)';
        notConnectedBtn.style.background = 'transparent';
        notConnectedBtn.style.color = '#9ca3af';
        notConnectedBtn.style.boxShadow = 'none';
    } else {
        notConnectedBtn.style.background = 'linear-gradient(135deg, #023747 0%, #1ba8af 100%)';
        notConnectedBtn.style.color = 'white';
        notConnectedBtn.style.boxShadow = '0 2px 6px rgba(27,168,175,0.3)';
        connectedBtn.style.background = 'transparent';
        connectedBtn.style.color = '#9ca3af';
        connectedBtn.style.boxShadow = 'none';
    }

    // Show/hide fields
    document.getElementById('callNotConnectedBanner').style.display = isConnected ? 'none' : 'block';
    document.getElementById('callDurationGroup').style.display = isConnected ? 'block' : 'none';
    document.getElementById('callReasonGroup').style.display = isConnected ? 'none' : 'block';
    document.getElementById('callNotesGroup').style.display = isConnected ? 'block' : 'none';
    document.getElementById('callActionsGroup').style.display = isConnected ? 'block' : 'none';

    // Update label
    document.getElementById('callContactLabel').textContent = isConnected ? 'Spoke With' : 'Tried to Reach';
}

function setupCallCustomerCombobox() {
    const input = document.getElementById('callCustomerInput');
    const dropdown = document.getElementById('callCustomerDropdown');

    // Clone to remove old listeners
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);

    newInput.addEventListener('focus', () => {
        updateCallCustomerDropdown(newInput.value);
        dropdown.classList.add('active');
    });
    newInput.addEventListener('input', () => {
        updateCallCustomerDropdown(newInput.value);
        dropdown.classList.add('active');
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#callCustomerInput') && !e.target.closest('#callCustomerDropdown')) {
            dropdown.classList.remove('active');
        }
    });
}

function updateCallCustomerDropdown(searchTerm = '') {
    const dropdown = document.getElementById('callCustomerDropdown');
    const filtered = state.customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let html = '';
    if (searchTerm && !filtered.some(c => c.name.toLowerCase() === searchTerm.toLowerCase())) {
        html += `<div class="customer-dropdown-item new-customer" onclick="selectCallCustomer(null, '${escapeHtml(searchTerm)}')"><span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span> Add "${escapeHtml(searchTerm)}"</div>`;
    }
    filtered.forEach(c => {
        html += `<div class="customer-dropdown-item" onclick="selectCallCustomer('${c.id}', '${escapeHtml(c.name)}')">
            <div class="customer-dropdown-item-name">${escapeHtml(c.name)}</div>
        </div>`;
    });
    if (!html) html = '<div class="customer-dropdown-item" style="color:var(--text-secondary);text-align:center;font-size:0.75rem;">No customers</div>';
    dropdown.innerHTML = html;
}

function selectCallCustomer(customerId, customerName) {
    document.getElementById('callCustomerInput').value = customerName;
    callSelectedCustomerId = customerId;
    document.getElementById('callCustomerDropdown').classList.remove('active');
    if (customerId) loadCallQuickAddContacts(customerId);
}

function loadCallQuickAddContacts(customerId) {
    const container = document.getElementById('callQuickAddContacts');
    const list = document.getElementById('callQuickAddList');
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) { container.style.display = 'none'; return; }

    const contactsMap = new Map();
    if (customer.participants) {
        customer.participants.forEach(p => {
            const key = p.email ? p.email.toLowerCase() : p.name.toLowerCase();
            contactsMap.set(key, p);
        });
    }
    state.meetings.filter(m => m.customerId === customerId).forEach(meeting => {
        (meeting.participants || []).forEach(p => {
            const key = p.email ? p.email.toLowerCase() : p.name.toLowerCase();
            if (!contactsMap.has(key)) contactsMap.set(key, p);
        });
    });

    const contacts = Array.from(contactsMap.values()).filter(p => {
        const key = p.email ? p.email.toLowerCase() : p.name.toLowerCase();
        return !callContacts.some(c => {
            const ck = c.email ? c.email.toLowerCase() : c.name.toLowerCase();
            return ck === key;
        });
    });

    if (contacts.length === 0) { container.style.display = 'none'; return; }

    list.innerHTML = contacts.map(p => {
        const initials = p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const details = [p.role, p.email].filter(Boolean).join(' · ');
        const pJson = JSON.stringify(p).replace(/"/g, '&quot;');
        return `
            <div class="quick-add-contact-item" onclick='quickAddCallContact(${pJson})'>
                <div class="quick-add-contact-avatar">${initials}</div>
                <div class="quick-add-contact-info">
                    <div class="quick-add-contact-name">${escapeHtml(p.name)}</div>
                    ${details ? `<div class="quick-add-contact-details">${escapeHtml(details)}</div>` : ''}
                </div>
                <div class="quick-add-contact-icon"><span class="icon icon-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span></div>
            </div>`;
    }).join('');

    container.style.display = 'block';
}

function quickAddCallContact(contactData) {
    const key = contactData.email ? contactData.email.toLowerCase() : contactData.name.toLowerCase();
    if (callContacts.some(c => (c.email ? c.email.toLowerCase() : c.name.toLowerCase()) === key)) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Already added', 'error'); return;
    }
    callContacts.push(contactData);
    renderCallContactsList();
    if (callSelectedCustomerId) loadCallQuickAddContacts(callSelectedCustomerId);
}

function addCallContact() {
    const input = document.getElementById('callContactInput');
    const name = input.value.trim();
    if (!name) { showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter a name', 'error'); return; }
    const key = name.toLowerCase();
    if (callContacts.some(c => c.name.toLowerCase() === key)) {
        showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Already added', 'error'); return;
    }
    callContacts.push({ name });
    input.value = '';
    renderCallContactsList();
    if (callSelectedCustomerId) loadCallQuickAddContacts(callSelectedCustomerId);
}

function removeCallContact(index) {
    callContacts.splice(index, 1);
    renderCallContactsList();
    if (callSelectedCustomerId) loadCallQuickAddContacts(callSelectedCustomerId);
}

function renderCallContactsList() {
    const container = document.getElementById('callContactsList');
    if (callContacts.length === 0) {
        container.innerHTML = '<span style="font-size:0.75rem; color:var(--text-tertiary);">No contacts added yet</span>';
        return;
    }
    container.innerHTML = callContacts.map((c, i) => `
        <div style="display:inline-flex; align-items:center; gap:0.35rem; background:#f0fdf4;
                    border:1px solid #10b981; border-radius:8px; padding:0.2rem 0.5rem;
                    font-size:0.8rem; color:#065f46;">
            <span class="icon icon-check-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> ${escapeHtml(c.name)}
            <span onclick="removeCallContact(${i})" style="cursor:pointer; opacity:0.6; margin-left:0.2rem;">×</span>
        </div>`).join('');
}

function addCallAction() {
    const input = document.getElementById('callActionInput');
    const text = input.value.trim();
    if (!text) { showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter an action item', 'error'); return; }
    callActions.push(text);
    input.value = '';
    renderCallActionsList();
}

function removeCallAction(index) {
    callActions.splice(index, 1);
    renderCallActionsList();
}

function renderCallActionsList() {
    const container = document.getElementById('callActionsList');
    if (callActions.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = callActions.map((a, i) => `
        <div style="display:flex; align-items:center; justify-content:space-between;
                    background:#f3f4f6; border-radius:4px; padding:0.35rem 0.5rem;
                    font-size:0.85rem; margin-bottom:0.25rem;">
            <span><span class="icon icon-check-square"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span> ${escapeHtml(a)}</span>
            <span onclick="removeCallAction(${i})" style="cursor:pointer; color:var(--text-secondary);">×</span>
        </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('phoneCallForm');
    if (form) {
        form.addEventListener('submit', handlePhoneCallSubmit);
    }

    // Enter key on action input
    const actionInput = document.getElementById('callActionInput');
    if (actionInput) {
        actionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); addCallAction(); }
        });
    }

    // Enter key on contact input
    const contactInput = document.getElementById('callContactInput');
    if (contactInput) {
        contactInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); addCallContact(); }
        });
    }
});

function handlePhoneCallSubmit(e) {
    e.preventDefault();

    const mode = document.getElementById('callMode').value;
    const isConnected = mode === 'connected';
    const customerInput = document.getElementById('callCustomerInput').value.trim();
    const callDate = document.getElementById('callDate').value;

    if (!customerInput) { showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter a customer', 'error'); return; }
    if (!callDate) { showToast('<span class="icon icon-warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> Enter a date and time', 'error'); return; }

    // Resolve customer
    let customerId = callSelectedCustomerId;
    let customerName = customerInput;

    if (!customerId) {
        const existing = state.customers.find(c =>
            c.name.toLowerCase() === customerInput.toLowerCase()
        );
        if (existing) {
            customerId = existing.id;
            customerName = existing.name;
        } else {
            const newCustomer = {
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: customerInput,
                createdAt: new Date().toISOString()
            };
            state.customers.push(newCustomer);
            customerId = newCustomer.id;
            customerName = newCustomer.name;
        }
    }

// Sync contacts to customer
if (customerId && callContacts.length > 0) {
    const customer = state.customers.find(c => c.id === customerId);
    if (customer) {
        if (!customer.participants) customer.participants = [];
        callContacts.forEach(contact => {
            const key = contact.email ? contact.email.toLowerCase() : contact.name.toLowerCase();
            const exists = customer.participants.some(p =>
                (p.email ? p.email.toLowerCase() : p.name.toLowerCase()) === key
            );
            if (!exists) {
                customer.participants.push({
                    name: contact.name,
                    role: contact.role || '',
                    email: contact.email || '',
                    phone: contact.phone || ''
                });
            }
        });

        // Also refresh the participants section if visible
        if (state.currentCustomer === customerId) {
            showCustomerParticipantsSection(customerId);
        }
    }
}


// Build title from contacts
const contactNames = callContacts.length > 0
    ? callContacts.map(p => p.name).join(', ')
    : '';

const callTitle = isConnected
    ? `Call${contactNames ? ' · ' + contactNames : ''}`
    : `Call${contactNames ? ' · ' + contactNames : ''} — ${document.getElementById('callReason').value}`;

const callRecord = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'phone-call',
    title: callTitle,
    customerId,
    customerName,
    date: callDate,
    duration: isConnected ? (parseInt(document.getElementById('callDuration').value) || null) : null,
    connected: isConnected,
    reason: isConnected ? null : document.getElementById('callReason').value,
    participants: [...callContacts],
    notes: isConnected ? document.getElementById('callNotes').value.trim() : '',
    notesHTML: isConnected ? document.getElementById('callNotes').value.trim() : '',
    isPastMeeting: true,
    tabId: 'individual',
    createdAt: new Date().toISOString()
};


    // Create tasks from action items
    callActions.forEach(actionTitle => {
        state.tasks.unshift({
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: actionTitle,
            description: `From call: ${customerName} on ${new Date(callDate).toLocaleDateString()}`,
            priority: 'medium',
            status: 'todo',
            dueDate: '',
            tags: ['call'],
            color: 'none',
            subtasks: [],
            completed: false,
            archived: false,
            customerId,
            customerName,
            meetingId: callRecord.id,
            createdAt: new Date().toISOString()
        });
    });

    const existingId = document.getElementById('callId').value;
if (existingId) {
    // Editing existing call
    const index = state.meetings.findIndex(m => m.id === existingId);
    if (index !== -1) {
        callRecord.id = existingId;
        callRecord.createdAt = state.meetings[index].createdAt;
        state.meetings[index] = callRecord;

        // Update existing tasks linked to this call
        state.tasks = state.tasks.filter(t => t.meetingId !== existingId);
        callActions.forEach(actionTitle => {
            state.tasks.unshift({
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: actionTitle,
                description: `From call: ${customerName} on ${new Date(callDate).toLocaleDateString()}`,
                priority: 'medium',
                status: 'todo',
                dueDate: '',
                tags: ['call'],
                color: 'none',
                subtasks: [],
                completed: false,
                archived: false,
                customerId,
                customerName,
                meetingId: existingId,
                createdAt: new Date().toISOString()
            });
        });
    }
    showToast('<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Call updated!', 'success');
} else {
    // New call
    state.meetings.unshift(callRecord);
    showToast(isConnected ? '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Call logged!' : '<span class="icon icon-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span> Missed call logged!', 'success');
}

    saveData();
    renderCustomerFilters();
    updateStats();
    closePhoneCallModal();

    // Refresh visible sections
    if (state.currentCustomer === customerId) {
        showCustomerMeetingsSection(customerId);
        renderTimeline();
        renderTasks();
    }
    if (document.getElementById('customerActivitySection').classList.contains('active')) {
        renderCustomerActivity();
    }


}

// ========== PHONE CALL FUNCTIONS - END ==========


        init();
        window.addEventListener('beforeunload', saveData);

// Browser back/forward button navigation
history.replaceState({ view: 'dashboard' }, '', '#dashboard');
window.addEventListener('popstate', (e) => {
    const s = e.state;
    if (!s || s.view === 'dashboard') {
        showDashboard(false);
    } else if (s.view === 'customer' && s.customerId) {
        selectCustomerFromOverview(s.customerId, false);
    }
});
