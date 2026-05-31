-- 013: Audio Labels
-- Convert audio_urls from string array ["url1","url2"] to object array [{"label":"","url":"url1"}]
-- This allows custom titles per audio track

UPDATE public.lessons
SET audio_urls = (
  SELECT jsonb_agg(
    jsonb_build_object('label', '', 'url', elem::text)
  )
  FROM jsonb_array_elements_text(audio_urls) AS elem
)
WHERE audio_urls IS NOT NULL
  AND jsonb_typeof(audio_urls) = 'array'
  AND jsonb_array_length(audio_urls) > 0
  AND jsonb_typeof(audio_urls->0) = 'string';
