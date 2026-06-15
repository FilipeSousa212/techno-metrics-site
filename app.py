"""
Techno Metrics Solutions — wrapper Streamlit do site estático.

O site é HTML/CSS/JS puro. Aqui ele é carregado dentro de um componente HTML
do Streamlit (iframe), com o CSS e o JS embutidos e os assets (SVG) convertidos
para data-URI, já que caminhos relativos não resolvem dentro do iframe.
"""
import base64
import pathlib

import streamlit as st

BASE = pathlib.Path(__file__).parent


def read_text(name: str) -> str:
    return (BASE / name).read_text(encoding="utf-8")


def svg_data_uri(name: str) -> str:
    raw = (BASE / name).read_bytes()
    b64 = base64.b64encode(raw).decode("ascii")
    return f"data:image/svg+xml;base64,{b64}"


def build_html() -> str:
    html = read_text("index.html")
    css = read_text("styles.css")
    js = read_text("script.js")

    # Embute CSS e JS (remove os arquivos externos e o cache-busting ?v=).
    html = html.replace(
        '<link rel="stylesheet" href="styles.css?v=2" />',
        f"<style>\n{css}\n</style>",
    )
    html = html.replace(
        '<script src="script.js?v=2"></script>',
        f"<script>\n{js}\n</script>",
    )

    # Converte os assets SVG para data-URI (iframe não acessa caminhos relativos).
    html = html.replace("assets/logo.svg", svg_data_uri("assets/logo.svg"))
    html = html.replace("assets/favicon.svg", svg_data_uri("assets/favicon.svg"))

    return html


st.set_page_config(
    page_title="Techno Metrics Solutions",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Remove o padding/menu padrão do Streamlit para o site ocupar a tela toda.
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility: hidden;}
      .block-container {padding: 0 !important; max-width: 100% !important;}
      [data-testid="stAppViewContainer"] {background: #0a0e1a;}
    </style>
    """,
    unsafe_allow_html=True,
)

_html = build_html()

# st.iframe (Streamlit recente) ajusta a altura ao conteúdo automaticamente.
# Fallback para a API antiga em versões anteriores.
if hasattr(st, "iframe"):
    st.iframe(_html, width="stretch", height="content")
else:
    import streamlit.components.v1 as components

    components.html(_html, height=6000, scrolling=True)
