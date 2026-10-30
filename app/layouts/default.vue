<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <NuxtLink to="/" class="site-brand">
          <strong class="site-brand__name">Silver UI Lab</strong>
          <span class="site-brand__subtitle">前端介面作品集</span>
        </NuxtLink>

        <nav class="site-nav" aria-label="主要導覽">
          <NuxtLink to="/" class="site-nav__link" exact-active-class="is-active">首頁</NuxtLink>
          <NuxtLink to="/prediction" class="site-nav__link" exact-active-class="is-active">作品集</NuxtLink>
          <button class="site-nav__link" type="button">關於我</button>
          <button class="site-nav__link" type="button">GitHub</button>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <nav class="site-footer__nav" aria-label="頁尾導覽">
          <button class="site-footer__link" type="button">首頁</button>
          <button class="site-footer__link" type="button">作品集</button>
          <button class="site-footer__link" type="button">關於我</button>
          <button class="site-footer__link" type="button">GitHub</button>
        </nav>
        <span class="site-footer__divider" aria-hidden="true"></span>
        <div class="site-footer__meta">
          <span>Nuxt 4 · Vue 3 · TypeScript · SCSS</span>
          <span>© 2026 Silver UI Lab. All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: Arial, "Microsoft JhengHei", sans-serif;
}

:global(*),
:global(*::before),
:global(*::after) {
  box-sizing: border-box;
}

.site-shell {
  --site-header-height: 72px;
  --site-content-top: var(--site-header-height);
  --prediction-sticky-top: var(--site-header-height);
  --prediction-panel-sticky-top: calc(var(--site-header-height) + 12px);
  --site-bg: linear-gradient(
    105deg,
    #ffffff 0%,
    #f4f9ff 36%,
    #dceaff 68%,
    #b8d1ff 100%
  );
  --site-surface: #fff;
  --site-text: #0a1a43;
  --site-text-muted: #7e8aa3;
  --site-border: #e1e8ef;
  --site-accent: #0646c9;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--site-bg);
  color: var(--site-text);
}

.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: var(--site-header-height);
  padding-inline: 12px;
  background: linear-gradient(
    105deg,
    #ffffff 0%,
    #ffffff 39%,
    #f2f7ff 72%,
    #e5efff 100%
  );
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.site-brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
  white-space: nowrap;
  text-decoration: none;
}

.site-brand:focus-visible {
  outline: 2px solid var(--site-accent);
  outline-offset: 3px;
}

.site-brand__name {
  color: var(--site-text);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.site-brand__subtitle {
  color: var(--site-text-muted);
  font-size: 12px;
}

.site-nav {
  display: flex;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  gap: 22px;
}

.site-nav__link {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding-inline: 2px;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--site-text);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.site-nav__link:hover {
  color: var(--site-accent);
}

.site-nav__link:focus-visible {
  outline: 2px solid var(--site-accent);
  outline-offset: 3px;
}

.site-nav__link.is-active {
  border-bottom-color: var(--site-accent);
  color: var(--site-accent);
}

.site-main {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding-top: var(--site-content-top);
}

.site-footer {
  border-top: 1px solid var(--site-border);
  background: linear-gradient(
    105deg,
    #ffffff 0%,
    #ffffff 39%,
    #f2f7ff 72%,
    #e5efff 100%
  );
}

.site-footer__inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 12px;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
}

.site-footer__link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #697895;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}

.site-footer__link:hover {
  color: var(--site-accent);
}

.site-footer__link:focus-visible {
  outline: 2px solid var(--site-accent);
  outline-offset: 3px;
}

.site-footer__divider {
  display: none;
}

.site-footer__meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #697895;
  font-size: 13px;
  line-height: 1.4;
}

@media (min-width: 576px) {
  .site-header__inner,
  .site-footer__inner {
    max-width: 550px;
  }
}

@media (min-width: 768px) {
  .site-header__inner,
  .site-footer__inner {
    max-width: 730px;
  }
}

@media (min-width: 992px) {
  .site-shell {
    --site-header-height: 84px;
  }

  .site-header {
    padding-inline: 28px;
  }

  .site-brand__name {
    font-size: 26px;
  }

  .site-brand__subtitle {
    font-size: 14px;
  }

  .site-nav {
    gap: 42px;
  }

  .site-nav__link {
    font-size: 16px;
  }

  .site-header__inner,
  .site-footer__inner {
    max-width: 970px;
  }

  .site-footer__inner {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 48px;
    min-height: 110px;
    padding: 22px 28px;
  }

  .site-footer__nav {
    gap: 26px;
  }

  .site-footer__divider {
    display: block;
    width: 1px;
    height: 27px;
    background: #cbd9ef;
  }
}

@media (min-width: 1200px) {
  .site-header__inner,
  .site-footer__inner {
    max-width: 1150px;
  }
}

@media (min-width: 1400px) {
  .site-header__inner,
  .site-footer__inner {
    max-width: 1280px;
  }
}

@media (max-width: 575px) {
  .site-shell {
    --site-header-height: 96px;
  }

  .site-header {
    padding-inline: 16px;
  }

  .site-header__inner {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 4px;
  }

  .site-brand__name {
    font-size: 16px;
  }

  .site-brand__subtitle {
    font-size: 10px;
  }

  .site-nav {
    justify-content: space-between;
    gap: 4px;
  }

  .site-nav__link {
    height: 28px;
    font-size: 11px;
  }
}
</style>
