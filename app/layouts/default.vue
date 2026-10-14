<script setup lang="ts">
const route = useRoute();
const isPrediction = computed(
  () => route.path === "/prediction" || route.path.startsWith("/prediction/"),
);
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <div class="site-brand">
          <strong class="site-brand__name">Silver UI Lab</strong>
          <span class="site-brand__subtitle">Frontend UI Portfolio</span>
        </div>

        <nav class="site-nav" aria-label="主要導覽">
          <NuxtLink
            to="/prediction"
            class="site-nav__link"
            :class="{ 'is-active': isPrediction }"
            :aria-current="isPrediction ? 'page' : undefined"
          >
            <span class="site-nav__prediction-full">Prediction</span>
            <span class="site-nav__prediction-short">Demo</span>
          </NuxtLink>
          <a
            class="site-nav__link"
            href="https://github.com/Silverhs-prg/frontend-ui-lab"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub</a>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <div class="site-container">
        <slot />
      </div>
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__about">
          <strong>Silver UI Lab</strong>
          <span>Frontend UI experiments and interaction studies.</span>
        </div>
        <div class="site-footer__meta">
          <span class="site-footer__tech">
            <strong>Tech</strong>
            <span>Nuxt 4 · Vue 3 · TypeScript · SCSS</span>
          </span>
          <span class="site-footer__credits">
            © 2026 Silver UI Lab
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/Silverhs-prg/frontend-ui-lab"
              target="_blank"
              rel="noopener noreferrer"
            >GitHub</a>
          </span>
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
  --site-header-height: 56px;
  --site-content-top: var(--site-header-height);
  --prediction-sticky-top: var(--site-header-height);
  --prediction-panel-sticky-top: calc(var(--site-header-height) + 12px);
  --site-bg: #f3f5f7;
  --site-surface: #fff;
  --site-text: #173a63;
  --site-text-muted: #6b7c8e;
  --site-border: #e1e8ef;
  --site-accent: #2d86c4;

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
  border-bottom: 1px solid var(--site-border);
  background: var(--site-surface);
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
  align-items: baseline;
  gap: 12px;
  min-width: 0;
  white-space: nowrap;
}

.site-brand__name {
  color: var(--site-text);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.site-brand__subtitle {
  display: none;
  color: var(--site-text-muted);
  font-size: 11px;
}

.site-nav {
  display: flex;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  gap: 14px;
}

.site-nav__link {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding-inline: 2px;
  border-bottom: 2px solid transparent;
  color: var(--site-text-muted);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.site-nav__link:hover,
.site-footer a:hover {
  color: var(--site-accent);
}

.site-nav__link:focus-visible,
.site-footer a:focus-visible {
  outline: 2px solid var(--site-accent);
  outline-offset: 3px;
}

.site-nav__link.is-active {
  border-bottom-color: var(--site-accent);
  color: var(--site-accent);
}

.site-nav__prediction-full {
  display: none;
}

.site-main {
  flex: 1;
  min-width: 0;
}

.site-container {
  width: 100%;
  margin: 0 auto;
  padding-top: var(--site-content-top);
}

.site-footer {
  border-top: 1px solid var(--site-border);
  background: var(--site-surface);
}

.site-footer__inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 12px 24px;
}

.site-footer__about,
.site-footer__meta,
.site-footer__tech,
.site-footer__credits {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.site-footer__about strong,
.site-footer__tech strong {
  color: var(--site-text);
  font-size: 13px;
  font-weight: 700;
}

.site-footer__about span,
.site-footer__tech span,
.site-footer__credits {
  color: var(--site-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.site-footer__credits {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.site-footer a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

@media (min-width: 576px) {
  .site-container,
  .site-header__inner,
  .site-footer__inner {
    max-width: 550px;
  }

  .site-nav__prediction-full {
    display: inline;
  }

  .site-nav__prediction-short {
    display: none;
  }
}

@media (min-width: 768px) {
  .site-container,
  .site-header__inner,
  .site-footer__inner {
    max-width: 730px;
  }

  .site-brand__subtitle {
    display: inline;
  }
}

@media (min-width: 992px) {
  .site-shell {
    --site-header-height: 78px;
  }

  .site-header {
    padding-inline: 28px;
  }

  .site-brand__name {
    font-size: 17px;
  }

  .site-nav {
    gap: 24px;
  }

  .site-nav__link {
    font-size: 14px;
  }

  .site-container,
  .site-header__inner,
  .site-footer__inner {
    max-width: 970px;
  }

  .site-footer__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    min-height: 110px;
    padding: 22px 28px;
  }

  .site-footer__meta {
    align-items: flex-end;
    text-align: right;
  }
}

@media (min-width: 1200px) {
  .site-container,
  .site-header__inner,
  .site-footer__inner {
    max-width: 1150px;
  }
}

@media (min-width: 1400px) {
  .site-container,
  .site-header__inner,
  .site-footer__inner {
    max-width: 1440px;
  }
}

@media (min-width: 1600px) {
  .site-container,
  .site-header__inner,
  .site-footer__inner {
    max-width: 1560px;
  }
}

@media (min-width: 1920px) {
  .site-container,
  .site-header__inner,
  .site-footer__inner {
    max-width: 1840px;
  }
}
</style>