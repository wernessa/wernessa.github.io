import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
const supabaseUrl = 'https://qoytgmrcnybqzcmnhhks.supabase.co';
const supabaseKey = 'mbLzwyytFJpjIDjNHLjhleXR3uiDrkvTb6VkIlQTRxTYlHi89Wv9lWnis1u4P772cYi2iciVnZfd6t5w1ATISQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function displayArticles() {
  const container = document.getElementById('articles-container');
  const sortSelect = document.getElementById('sort-select');
  const sortValue = sortSelect ? sortSelect.value : 'created_at.desc';
  const [column, direction] = sortValue.split('.');

  const { data: article } = await supabase
    .from('article')
    .select('title, subtitle, author, created_at, content')
    .order(column, { ascending: direction === 'asc' });


  let html = '';
  article.forEach((item, i) => {
    html += `<div class="article">
      <h3>Artykuł ${i + 1}</h3>
      <p>Tytuł: ${item.title}</p>
      <p>Podtytuł: ${item.subtitle}</p>
      <p>Autor: ${item.author}</p>
      <p>Data utworzenia: ${format(new Date(item.created_at), 'dd-MM-yyyy')}</p>
      <p>Treść:${item.content}</p>
    </div>`;
  });

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  displayArticles();

  const form = document.getElementById('article-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.title.value;
    const subtitle = form.subtitle.value;
    const author = form.author.value;
    const content = form.content.value;
    const createdAtRaw = form.created_at.value;
    const created_at = new Date(createdAtRaw).toISOString(); // poprawny format daty

    await supabase
      .from('article')
      .insert([{ title, subtitle, author, content, created_at }]);

    form.reset();
    displayArticles();
  });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', displayArticles);
  }
});
