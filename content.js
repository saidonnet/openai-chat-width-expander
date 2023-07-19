const style = document.createElement('style');
style.textContent = `
::-webkit-scrollbar {
	width: 1rem;
}
@media (min-width: 1280px) {
    * {
        max-width: unset !important;
        overflow: auto !important;
    }
}

@media (min-width: 1024px) {
    * {
        max-width: unset !important;
        overflow: auto !important;
    }
}

@media (min-width: 768px) {
    * {
        max-width: unset !important;
        overflow: auto !important;
    }
}
`;
document.head.append(style);
