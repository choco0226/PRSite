// ナビゲーション機能
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

function switchToPage(targetPageId) {
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 少し遅延してからページ切り替え（スムーズなスクロールのため）
    setTimeout(() => {
        // アクティブクラスをリセット
        navLinks.forEach(nav => nav.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        // 新しいアクティブ要素を設定
        const targetNavLink = document.querySelector(`[data-page="${targetPageId}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }, 100);
}

// ナビゲーションリンクのクリック処理
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = link.dataset.page;
        switchToPage(targetPageId);
    });
});

// TOPページのクリック可能なアイテムの処理
const clickableItems = document.querySelectorAll('.work-item.clickable');
clickableItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = item.dataset.page;
        switchToPage(targetPageId);
    });
});

// モーダル機能
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalVideo = document.getElementById('modal-video');
const modalVideoSource = document.getElementById('modal-video-source');
const closeBtn = document.querySelector('.close');

// クリック可能なメディア要素にイベントリスナーを追加
function initializeMediaClickHandlers() {
    const clickableMedia = document.querySelectorAll('.clickable-media');
    
    clickableMedia.forEach(media => {
        media.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (media.tagName.toLowerCase() === 'img') {
                // 画像の場合
                showImageModal(media);
            } else if (media.tagName.toLowerCase() === 'video') {
                // 動画の場合
                showVideoModal(media);
            }
        });
    });
}

// 画像モーダルを表示
function showImageModal(imgElement) {
    modalImg.src = imgElement.src;
    modalImg.alt = imgElement.alt;
    modalImg.classList.add('active');
    modalVideo.classList.remove('active');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 動画モーダルを表示
function showVideoModal(videoElement) {
    const source = videoElement.querySelector('source');
    if (source) {
        modalVideoSource.src = source.src;
        modalVideo.load(); // 動画を再読み込み
    }
    modalVideo.classList.add('active');
    modalImg.classList.remove('active');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 動画を自動再生
    setTimeout(() => {
        modalVideo.play().catch(e => {
            console.log('動画の自動再生に失敗しました:', e);
        });
    }, 100);
}

// モーダルを閉じる
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // 動画を停止
    modalVideo.pause();
    modalVideo.currentTime = 0;
    
    // アクティブクラスをリセット
    modalImg.classList.remove('active');
    modalVideo.classList.remove('active');
}

// モーダル関連のイベントリスナー
closeBtn.addEventListener('click', closeModal);

// モーダルの背景をクリックしたときに閉じる
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// 動画再生オーバーレイを追加
function addVideoOverlays() {
    const videos = document.querySelectorAll('video.clickable-media');
    
    videos.forEach(video => {
        const container = video.parentElement;
        
        // 既にオーバーレイが存在する場合はスキップ
        if (container.querySelector('.video-overlay')) {
            return;
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.innerHTML = '▶';
        container.style.position = 'relative';
        container.appendChild(overlay);
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeMediaClickHandlers();
    addVideoOverlays();
});

// 動的に追加されたコンテンツにも対応するため、定期的にハンドラーを再初期化
// （実際の使用では、コンテンツが追加されるタイミングで呼び出すのが適切）
setInterval(() => {
    initializeMediaClickHandlers();
    addVideoOverlays();
}, 1000);

// 動画の読み込みエラーハンドリング
document.addEventListener('error', (e) => {
    if (e.target.tagName.toLowerCase() === 'video') {
        console.log('動画の読み込みに失敗しました:', e.target.src);
        // エラー時の処理（プレースホルダーを表示など）
        const placeholder = e.target.nextElementSibling;
        if (placeholder && placeholder.classList.contains('work-image')) {
            e.target.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }
}, true);

// 画像の読み込みエラーハンドリング
document.addEventListener('error', (e) => {
    if (e.target.tagName.toLowerCase() === 'img' && e.target.classList.contains('media-item')) {
        console.log('画像の読み込みに失敗しました:', e.target.src);
        // エラー時の処理は既にHTMLのonerror属性で処理済み
    }
}, true);

// スムーズスクロール機能の強化
function smoothScrollToTop() {
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    const duration = 600;

    function scroll() {
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, ((now - startTime) / duration));
        const timeFunction = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
        
        window.scroll(0, Math.ceil((timeFunction * (0 - start)) + start));
        
        if (window.pageYOffset === 0) {
            return;
        }
        
        requestAnimationFrame(scroll);
    }
    
    scroll();
}

// パフォーマンス最適化: Intersection Observer を使用して画像の遅延読み込み
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        }
    });
});

// 遅延読み込み対象の画像を監視
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
});