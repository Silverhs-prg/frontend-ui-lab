<template>
  <div class="landing-page">
    <section class="landing-hero" aria-labelledby="landing-title">
      <div class="landing-container">
        <div class="landing-hero__content">
          <p class="landing-eyebrow">Silver UI Lab</p>
          <h1 id="landing-title">打造更好的網頁使用體驗</h1>
          <p class="landing-hero__description">前端 UI / UX 練習與作品展示</p>
          <NuxtLink to="/prediction" class="landing-hero__action">查看作品</NuxtLink>
        </div>
      </div>
    </section>

    <section class="landing-projects" aria-labelledby="projects-title">
      <div class="landing-container">
        <header class="landing-projects__header">
          <p class="landing-eyebrow">Featured Works</p>
          <h2 id="projects-title">精選作品</h2>
        </header>

        <div class="landing-projects__grid">
          <NuxtLink to="/prediction" class="landing-project-card">
            <div class="landing-project-card__preview">Prediction UI Placeholder</div>
            <div class="landing-project-card__content">
              <span>Sports / Prediction</span>
              <h3>Prediction Interface</h3>
              <p>賽事預測與互動投注介面設計。</p>
            </div>
          </NuxtLink>

          <article class="landing-project-card landing-project-card--placeholder">
            <div class="landing-project-card__preview">Ecommerce Placeholder</div>
            <div class="landing-project-card__content">
              <span>Ecommerce</span>
              <h3>Coming Soon</h3>
            </div>
          </article>

          <article class="landing-project-card landing-project-card--placeholder">
            <div class="landing-project-card__preview">Dashboard Placeholder</div>
            <div class="landing-project-card__content">
              <span>Dashboard</span>
              <h3>Coming Soon</h3>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page,
.landing-hero,
.landing-projects {
  width: 100%;
}

.landing-page {
  display: flex;
  flex-direction: column;
}

.landing-container {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: clamp(20px, 3vw, 48px);
}

.landing-hero {
  padding-block: clamp(28px, 5vh, 48px);
  background-color: #f5f9ff;
  background-image: url('../assets/landing/hero-background.png');
  background-position: center;
  background-size: cover;
}

.landing-hero__content {
  max-width: 720px;
}

.landing-eyebrow {
  margin: 0 0 8px;
  color: var(--site-accent);
  font-size: 14px;
  font-weight: 700;
}

.landing-hero h1 {
  margin: 0;
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.2;
}

.landing-hero__description {
  margin: 16px 0 20px;
  color: var(--site-text-muted);
  font-size: 18px;
  line-height: 1.6;
}

.landing-hero__action {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 10px 20px;
  border-radius: 8px;
  background: var(--site-accent);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.landing-hero__action:focus-visible,
.landing-project-card:focus-visible {
  outline: 2px solid var(--site-accent);
  outline-offset: 3px;
}

.landing-projects {
  flex: 1;
  padding-block: clamp(24px, 3vh, 32px) clamp(28px, 3vh, 40px);
  background-color: #f5f9ff;
  background-image: url('../assets/landing/projects-background.png');
  background-position: center;
  background-size: cover;
}

.landing-projects__header {
  margin-bottom: 16px;
}

.landing-projects__header h2 {
  margin: 0;
  font-size: 30px;
}

.landing-projects__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}

.landing-project-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--site-border);
  border-radius: 12px;
  background: #fff;
  color: inherit;
  text-decoration: none;
}

.landing-project-card__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(120px, 16vh, 156px);
  padding: 20px;
  background: #edf3fc;
  color: #60718e;
  text-align: center;
}

.landing-project-card__content {
  padding: 16px;
}

.landing-project-card__content span {
  color: var(--site-accent);
  font-size: 13px;
}

.landing-project-card__content h3 {
  margin: 8px 0;
  font-size: 20px;
}

.landing-project-card__content p {
  margin: 0;
  color: var(--site-text-muted);
  line-height: 1.5;
}

.landing-project-card--placeholder {
  color: var(--site-text-muted);
}

@media (min-width: 768px) {
  .landing-projects__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 992px) {
  .landing-page {
    min-height: calc(100vh - var(--site-header-height) - 111px);
    min-height: calc(100dvh - var(--site-header-height) - 111px);
  }
}

@media (min-width: 1200px) {
  .landing-page {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
  }

  .landing-projects__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) and (max-height: 960px) {
  .landing-projects {
    padding-block: 20px;
  }

  .landing-projects__header {
    margin-bottom: 8px;
  }

  .landing-project-card__preview {
    min-height: 112px;
  }

  .landing-project-card__content {
    padding: 12px;
  }
}

@media (min-width: 1200px) and (max-height: 800px) {
  .landing-hero {
    padding-block: 24px;
  }

  .landing-projects {
    padding-block: 12px;
  }

  .landing-project-card__preview {
    min-height: 80px;
  }
}

@media (max-width: 575px) {
  .landing-hero {
    padding-block: 40px;
    background-position: 38% center;
  }

  .landing-projects {
    padding-block: 32px 48px;
  }
}
</style>
