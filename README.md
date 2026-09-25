# Television energy choices in Australia

## Data story

Website: https://data-visualisation-indol.vercel.app/televisions.html

This story is for Australian television buyers. It helps readers compare common screen sizes, typical rated power and displayed energy-star ratings before choosing a model.

## Story sequence

1. Set the context with the available display technologies.
2. Show which screen sizes are listed most often.
3. Compare the range of registered models by brand.
4. Compare median average-mode power by display technology.
5. Show the relationship between screen size and average-mode power.
6. Check whether screen size is associated with the displayed Star2 rating.

The website focuses on questions 2, 4, 5 and 6. The Miro storyboard covers all six questions: https://miro.com/app/board/uXjVHiPIa2Y=/

## About the data

The source is the course-provided Australian television energy-rating CSV, data/tv_2026_09_22.csv, dated 22 September 2026. The CSV contains 5,036 rows. The KNIME workflow keeps the highest numeric Submit_ID for each Model_No (4,771 rows), keeps products marked Available (4,768 rows), then keeps records whose SoldIn field includes Australia (4,591 rows).

The charts use that Australian subset. Screen diagonals in centimetres are rounded to the nearest inch for the size chart. Brand capitalization is consolidated, while distinct registered brand names remain separate. Median Avg_mode_power is used for technology comparisons. Star2 is used for the displayed star-rating comparison. Records missing the relevant numeric values are omitted from that chart.

The corrected workflow is packaged in the workflow folder. It reads its CSV from the KNIME workflow data area, sends every analysis branch through the Australia filter, ranks the top 10 brands, and uses Star2 for the displayed-rating chart.

## Accuracy, limitations and ethics

The data is a dated register snapshot; availability can change. Counts describe registered models in the dataset, not sales or market share. Rated power comes from product test information and does not predict an individual household bill. The dataset does not include product prices, household viewing time or measured household consumption. The technology comparison is not adjusted for screen size, which is strongly associated with power use. Registered brand variants can appear separately.

The dataset contains product and registration information, with no personal household data. The source CSV is included so the data fields and transformations can be reviewed.

## AI Declaration

OpenAI Codex assisted with data checks, chart code, page structure and wording. I reviewed the calculations and final pages. I am responsible for explaining and verifying the submitted work.

## Files

- index.html and the supporting styles, scripts and assets retain the T01(a) website.
- televisions.html is the direct T03 data-story page.
- data/tv_2026_09_22.csv is the supplied source dataset.
- data/story-data.json contains the filtered chart values and plotted records used by the pages.
- workflow/data_visualization_1b_T03_fixed.knwf is the corrected KNIME workflow with its data file packaged inside.
