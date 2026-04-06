-- Seed data for English Smart

-- Achievements (10)
INSERT INTO public.achievements (id, title, description, icon, condition_type, condition_value, points) VALUES
  (gen_random_uuid(), 'Primeira Aula', 'Completou sua primeira aula', 'trophy', 'lessons_completed', 1, 10),
  (gen_random_uuid(), 'Sequencia 7 Dias', 'Manteve uma sequencia de 7 dias seguidos', 'fire', 'streak_days', 7, 50),
  (gen_random_uuid(), 'Modulo 1 Completo', 'Completou todos os exercicios do Modulo 1', 'star', 'module_completed', 1, 100),
  (gen_random_uuid(), 'Modulo 2 Completo', 'Completou todos os exercicios do Modulo 2', 'star', 'module_completed', 2, 100),
  (gen_random_uuid(), 'Modulo 3 Completo', 'Completou todos os exercicios do Modulo 3', 'star', 'module_completed', 3, 100),
  (gen_random_uuid(), 'Modulo 4 Completo', 'Completou todos os exercicios do Modulo 4', 'star', 'module_completed', 4, 100),
  (gen_random_uuid(), 'Missao Aprovada', 'Recebeu nota acima de 8 em uma missao', 'check-circle', 'mission_grade_above', 8, 30),
  (gen_random_uuid(), 'Aluno Nota 10', 'Recebeu nota 10 em uma missao', 'award', 'mission_grade_above', 10, 50),
  (gen_random_uuid(), 'Maratonista', 'Completou 10 aulas em uma semana', 'zap', 'lessons_week', 10, 75),
  (gen_random_uuid(), 'Fluente', 'Completou todos os modulos do curso', 'globe', 'all_modules_completed', 1, 500)
ON CONFLICT DO NOTHING;

-- Modules (4)
INSERT INTO public.modules (id, title, description, order_index, total_lessons, is_active, cover_image_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Foundations', 'Aprenda o basico do ingles: alfabeto, numeros, cumprimentos e apresentacoes.', 1, 3, true, '/images/modules/foundations.jpg'),
  ('00000000-0000-0000-0000-000000000002', 'Daily Life', 'Vocabulario e expressoes para o dia a dia: rotina, comida, compras e transporte.', 2, 3, true, '/images/modules/daily-life.jpg'),
  ('00000000-0000-0000-0000-000000000003', 'Communication', 'Desenvolva habilidades de comunicacao: conversacao, telefone, email e reunioes.', 3, 3, true, '/images/modules/communication.jpg'),
  ('00000000-0000-0000-0000-000000000004', 'Advanced Skills', 'Nivel avancado: apresentacoes, negociacoes, escrita formal e fluencia.', 4, 3, true, '/images/modules/advanced.jpg')
ON CONFLICT (id) DO NOTHING;

-- Lessons (12 total, 3 per module)
-- Module 1: Foundations
INSERT INTO public.lessons (id, module_id, title, description, order_index, is_published, task_description) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'The Alphabet & Sounds', 'Aprenda o alfabeto ingles e os sons das letras.', 1, true, 'Grave um audio dizendo o alfabeto completo.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Numbers & Greetings', 'Numeros de 1 a 100 e cumprimentos basicos.', 2, true, 'Escreva 5 frases de apresentacao usando numeros.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Introducing Yourself', 'Aprenda a se apresentar em ingles com confianca.', 3, true, 'Grave um video de 1 minuto se apresentando em ingles.')
ON CONFLICT DO NOTHING;

-- Module 2: Daily Life
INSERT INTO public.lessons (id, module_id, title, description, order_index, is_published, task_description) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Daily Routine', 'Vocabulario e expressoes sobre rotina diaria.', 1, true, 'Descreva sua rotina diaria em ingles (minimo 10 frases).'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Food & Restaurants', 'Como pedir comida e interagir em restaurantes.', 2, true, 'Simule um dialogo em um restaurante.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Shopping & Transport', 'Vocabulario para compras e transporte publico.', 3, true, 'Crie um dialogo de compras em uma loja.')
ON CONFLICT DO NOTHING;

-- Module 3: Communication
INSERT INTO public.lessons (id, module_id, title, description, order_index, is_published, task_description) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Small Talk', 'Domine a arte da conversa casual em ingles.', 1, true, 'Pratique small talk com 3 topicos diferentes.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Phone & Email', 'Como se comunicar por telefone e email profissional.', 2, true, 'Escreva um email profissional em ingles.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Meetings & Presentations', 'Vocabulario e expressoes para reunioes.', 3, true, 'Prepare uma mini-apresentacao de 2 minutos.')
ON CONFLICT DO NOTHING;

-- Module 4: Advanced Skills
INSERT INTO public.lessons (id, module_id, title, description, order_index, is_published, task_description) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', 'Business English', 'Ingles para negocios e ambiente corporativo.', 1, true, 'Escreva uma proposta comercial simples em ingles.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', 'Formal Writing', 'Tecnicas de escrita formal e academica.', 2, true, 'Escreva uma carta formal em ingles.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', 'Fluency & Confidence', 'Estrategias para alcancar fluencia e confianca.', 3, true, 'Grave um video de 3 minutos falando sobre um tema livre.')
ON CONFLICT DO NOTHING;

-- Notices (2)
INSERT INTO public.notices (id, title, content, type, is_active) VALUES
  (gen_random_uuid(), 'Bem-vindo ao English Smart!', 'Estamos felizes em ter voce aqui! Explore os modulos e comece sua jornada de aprendizado.', 'info', true),
  (gen_random_uuid(), 'Aulas ao vivo toda semana', 'As aulas ao vivo acontecem toda quarta-feira as 19h. Nao perca!', 'success', true)
ON CONFLICT DO NOTHING;

-- Library items (4)
INSERT INTO public.library_items (id, title, type, url, module_id, tags, is_active) VALUES
  (gen_random_uuid(), 'Guia de Pronuncia', 'pdf', '/library/pronunciation-guide.pdf', '00000000-0000-0000-0000-000000000001', '["pronuncia", "basico", "fonetica"]', true),
  (gen_random_uuid(), 'Lista de Verbos Irregulares', 'pdf', '/library/irregular-verbs.pdf', NULL, '["verbos", "gramatica", "intermediario"]', true),
  (gen_random_uuid(), 'Podcast: English Daily', 'link', 'https://open.spotify.com/show/example', NULL, '["podcast", "listening", "avancado"]', true),
  (gen_random_uuid(), 'Video: Dicas de Fluencia', 'video', 'https://youtube.com/watch?v=example', '00000000-0000-0000-0000-000000000004', '["fluencia", "dicas", "avancado"]', true)
ON CONFLICT DO NOTHING;
