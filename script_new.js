// =============================================
// PORTFOLIO — Modern Interactive Features
// GSAP + Three.js + Optimized Performance
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initCursor();
    initNavbar();
    initMobileMenu();
    initTypingEffect();
    initGSAPAnimations();
    initSkillBars();
    initProjectFilter();
    initContactForm();
    initBackToTop();
    initCountUp();
    initSmoothScroll();
});

// =============================================
// LOADER
// =============================================
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
                loader.style.visibility = 'hidden';
                loader.remove();
            }
        });
    });
}

// =============================================
// THREE.JS PARTICLE BACKGROUND
// =============================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || !window.THREE) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesCount = window.innerWidth < 768 ? 800 : 2000;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const amberColor = new THREE.Color('#e8a84c');
    const tealColor = new THREE.Color('#4ecdc4');

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;

        // Positions
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        // Velocities
        velocities[i3] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

        // Colors - mix between amber and teal
        const mixFactor = Math.random();
        const color = new THREE.Color().lerpColors(amberColor, tealColor, mixFactor);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        color: '#e8a84c',
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 3;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);

        frameCount++;
        // Update every 2 frames for performance
        if (frameCount % 2 !== 0) return;

        const positionsArray = geometry.attributes.position.array;
        const linePositionsArray = lineGeometry.attributes.position.array;
        let lineIndex = 0;

        // Update particle positions
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

            positionsArray[i3] += velocities[i3];
            positionsArray[i3 + 1] += velocities[i3 + 1];
            positionsArray[i3 + 2] += velocities[i3 + 2];

            // Boundary check
            if (Math.abs(positionsArray[i3]) > 5) velocities[i3] *= -1;
            if (Math.abs(positionsArray[i3 + 1]) > 5) velocities[i3 + 1] *= -1;
            if (Math.abs(positionsArray[i3 + 2]) > 5) velocities[i3 + 2] *= -1;
        }

        // Update connections (limit for performance)
        const connectionLimit = Math.min(particlesCount, 100);
        for (let i = 0; i < connectionLimit; i++) {
            for (let j = i + 1; j < connectionLimit; j++) {
                if (lineIndex >= linePositionsArray.length - 6) break;

                const i3 = i * 3;
                const j3 = j * 3;

                const dx = positionsArray[i3] - positionsArray[j3];
                const dy = positionsArray[i3 + 1] - positionsArray[j3 + 1];
                const dz = positionsArray[i3 + 2] - positionsArray[j3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < 1.5) {
                    linePositionsArray[lineIndex++] = positionsArray[i3];
                    linePositionsArray[lineIndex++] = positionsArray[i3 + 1];
                    linePositionsArray[lineIndex++] = positionsArray[i3 + 2];
                    linePositionsArray[lineIndex++] = positionsArray[j3];
                    linePositionsArray[lineIndex++] = positionsArray[j3 + 1];
                    linePositionsArray[lineIndex++] = positionsArray[j3 + 2];
                }
            }
        }

        // Clear remaining line positions
        for (let i = lineIndex; i < linePositionsArray.length; i++) {
            linePositionsArray[i] = 0;
        }

        geometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.position.needsUpdate = true;

        // Rotate based on mouse
        particles.rotation.x += mouseY * 0.0003;
        particles.rotation.y += mouseX * 0.0003;
        lines.rotation.x = particles.rotation.x;
        lines.rotation.y = particles.rotation.y;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

// =============================================
// CUSTOM CURSOR
// =============================================
function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    // Hide on touch devices
    if ('ontouchstart' in window || window.innerWidth < 768) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(dot, {
            x: mouseX,
            y: mouseY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Smooth ring follow with GSAP
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        gsap.set(ring, { x: ringX, y: ringY });
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .filter-btn');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
}

// =============================================
// NAVBAR
// =============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 50));

    highlightActiveSection();
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', throttle(() => {
        let current = '';
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// =============================================
// MOBILE MENU
// =============================================
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// =============================================
// TYPING EFFECT
// =============================================
function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const words = ['Web 开发者', 'UI 设计师', '问题解决者', '终身学习者'];
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let speed = 100;

    function type() {
        const word = words[wordIdx];

        if (deleting) {
            el.textContent = word.substring(0, charIdx - 1);
            charIdx--;
            speed = 40;
        } else {
            el.textContent = word.substring(0, charIdx + 1);
            charIdx++;
            speed = 80;
        }

        if (!deleting && charIdx === word.length) {
            speed = 2500;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1200);
}

// =============================================
// GSAP SCROLL ANIMATIONS
// =============================================
function initGSAPAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero section entrance
    const heroTl = gsap.timeline({ delay: 0.5 });

    heroTl
        .from('.hero-tag', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.title-line-1', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.title-line-2', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.title-line-3', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-desc', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-actions', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-stats', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-image-wrap', {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.scroll-hint', {
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.3');

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.gsap-reveal');

    revealElements.forEach((el, index) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: (index % 3) * 0.15,
            ease: 'power3.out'
        });
    });

    // Skill cards stagger
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%'
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Project cards stagger
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%'
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Parallax effect on hero glows
    gsap.to('.hero-glow-1', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        opacity: 0.02
    });

    gsap.to('.hero-glow-2', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -80,
        opacity: 0.02
    });

    // Image parallax
    gsap.to('.hero-image-frame', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 50,
        scale: 0.95
    });
}

// =============================================
// SKILL BARS
// =============================================
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');

                gsap.to(bar, {
                    width: width + '%',
                    duration: 1.5,
                    ease: 'power3.out',
                    delay: 0.3
                });

                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
}

// =============================================
// PROJECT FILTER
// =============================================
function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('bg-amber', 'text-dark-900', 'border-amber');
                b.classList.add('bg-transparent', 'text-[#8a8680]', 'border-white/10');
            });

            btn.classList.add('active');
            btn.classList.add('bg-amber', 'text-dark-900', 'border-amber');
            btn.classList.remove('bg-transparent', 'text-[#8a8680]', 'border-white/10');

            const filter = btn.getAttribute('data-filter');

            cards.forEach((card, i) => {
                const category = card.getAttribute('data-category');
                const show = filter === 'all' || category === filter;

                if (show) {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: 'power3.out',
                        onStart: () => {
                            card.style.display = '';
                        }
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        y: 20,
                        scale: 0.95,
                        duration: 0.3,
                        ease: 'power3.in',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// =============================================
// CONTACT FORM
// =============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>发送中...</span>';

        // Animate button
        gsap.to(btn, {
            scale: 0.95,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });

        setTimeout(() => {
            // Success animation
            gsap.to(btn, {
                backgroundColor: '#00d26a',
                duration: 0.3
            });

            alert('消息已发送！感谢你的联系。');
            form.reset();
            btn.disabled = false;
            btn.innerHTML = originalHTML;

            gsap.to(btn, {
                backgroundColor: '#e8a84c',
                duration: 0.3
            });
        }, 1500);
    });

    // Input focus animations
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.01,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });
}

// =============================================
// BACK TO TOP
// =============================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, 100));

    btn.addEventListener('click', () => {
        gsap.to(window, {
            scrollTo: { y: 0 },
            duration: 1,
            ease: 'power3.inOut'
        });
    });
}

// =============================================
// COUNT UP
// =============================================
function initCountUp() {
    const numbers = document.querySelectorAll('.stat-num');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));

                gsap.to(el, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out'
                });

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    numbers.forEach(n => observer.observe(n));
}

// =============================================
// SMOOTH SCROLL
// =============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                gsap.to(window, {
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    duration: 1,
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// =============================================
// THROTTLE UTILITY
// =============================================
function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =============================================
// MAGNETIC BUTTON EFFECT
// =============================================
document.querySelectorAll('.btn-primary, .btn-ghost, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// =============================================
// TILT EFFECT ON CARDS
// =============================================
document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
            rotateY: x * 5,
            rotateX: -y * 5,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

console.log('%c Portfolio Loaded Successfully ', 'background: #e8a84c; color: #0a0a0b; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
