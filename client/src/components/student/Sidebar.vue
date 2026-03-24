<template>
  <aside>
        <div class="sidebar-header">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            SaeTrack
        </div>
        
        <div class="nav-group">
            <div class="nav-label">Espace de travail</div>
            <nav>
                <router-link to="/student/dashboard" active-class="active">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                    Tableau de bord
                </router-link>
                <router-link to="/student/projects" active-class="active">
                    <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    Projets SAE (Sem. 4)
                </router-link>
                <router-link to="/student/deliverables" active-class="active">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Espace Documents
                </router-link>
                <router-link to="/student/grades" active-class="active">
                    <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Notes & Retours
                </router-link>
            </nav>
        </div>

        <div class="nav-group">
            <div class="nav-label">Archives</div>
            <nav>
                <router-link to="/student/archives" active-class="active">
                    <svg viewBox="0 0 24 24"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
                    Anciens semestres
                </router-link>
            </nav>
        </div>
        
        <div class="nav-group" style="margin-top: auto; padding-bottom: 24px;">
            <router-link to="/teacher" style="color: var(--status-info-text)">
                Basculer vers Prof
            </router-link>
        </div>
    </aside>
</template>

<script setup>
</script>
