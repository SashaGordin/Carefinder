export const careDescriptions = {
  L: (
    <>
      <div className="careDescription">
        <b>Description</b>: Seniors who are mostly independent but need
        occasional help.<br></br>
        <br></br>
        <ul>
          <li>
            <b>Daily Living:</b> Minimal assistance with daily activities as
            needed.
          </li>
          <li>
            <b>Health Monitoring:</b> Regular health checks and medication
            administration.
          </li>
          <li>
            <b>Social Activities:</b> Participation in social and recreational
            activities.
          </li>
          <li>
            <b>24/7 Supervision:</b> Light supervision to ensure safety and
            well-being.
          </li>
        </ul>
      </div>
    </>
  ),
  M: (
    <>
      <div className="careDescription">
        <b>Description</b>: Requires regular assistance with daily activities
        and supervision for safety.<br></br>
        <br></br>
        <ul>
          <li>
            <b>Daily Living:</b> Significant assistance with activities of daily
            living (ADLs), such as bathing, dressing, and meal preparation.
          </li>
          <li>
            <b>Health Monitoring:</b> Frequent health checks and medication
            administration.
          </li>
          <li>
            <b>Cognitive Support:</b> Mild cognitive stimulation and memory care
            assistance.Specialized dementia care and behavioral management.
          </li>
          <li>
            <b>24/7 Supervision:</b> Increased supervision to prevent accidents
            and wandering.
          </li>
        </ul>
      </div>
    </>
  ),
  H: (
    <>
      <div className="careDescription">
        <b>Description</b>: Needs substantial help with most activities and
        constant supervision.<br></br>
        <br></br>
        <ul>
          <li>
            <b>Daily Living:</b> Extensive assistance with ADLs, including
            incontinence care and personal hygiene.
          </li>
          <li>
            <b>Health Monitoring:</b> Continuous health monitoring and
            medication administration.
          </li>
          <li>
            <b>Cognitive Support:</b> Specialized dementia care and behavioral
            management.
          </li>
          <li>
            <b>24/7 Supervision:</b> Constant supervision to ensure safety and
            well-being.
          </li>
        </ul>
      </div>
    </>
  ),
  T: (
    <>
      <div className="careDescription">
        <b>Description</b>: Completely dependent on caregivers for all daily
        tasks and medical care.<br></br>
        <br></br>
        <ul>
          <li>
            <b>Personal Care:</b> Full assistance with all ADLs, possibly
            bedridden.
          </li>
          <li>
            <b>Mobility:</b> Completely dependent on caregivers for movement.
          </li>
          <li>
            <b>Specialized Care:</b> Specialized treatments, such as wound care
          </li>
          <li>
            <b>Constant Supervision:</b> Continuous monitoring to prevent
            complications and ensure comfort.
          </li>
        </ul>
      </div>
    </>
  ),
};

export const arrBaseServices = [
  'Breakfast, Lunch, and Dinner',
  'Snacks any time',
  'Medications management',
  'Housekeeping',
  'Personal Laundry',
  'Social activities',
  '24 /7 light care',
];
export const careLevelNames = {
  L: 'Light care',
  M: 'Medium care',
  H: 'Heavy care',
  T: 'Total care',
};
export const defaultCOCServiceList = [
  'Support with feeding',
  <>
    <b>Dietary Services:</b> Customized meal plans and dietary restrictions.
  </>,
  'Excessive personal laundry',
  'Special activities (one on one)',
  'Excessive toiling, Incontinence care',
  <>
    <b>Physical, Occupational, and Speech Therapy:</b> Professional therapy
    services.
  </>,
  'Wound care',
  'End of life Care',
  'Traumatic brain injury',
];
export const defaultHighlightedFeatureList = [
  <>
    <b>Salon Services:</b> Hair styling, manicures, and pedicures.
  </>,
  'Garden ',
  'Views, mountains, waters ',
  'Library ',
  'Private calls via Home phone',
  'Generator',
  'Air conditioning',
  'Internet',
  'Near Hospital',
  'Security camera (Outside)',
  'Sprinkler system',
  'Close to bus line',
  'Private dinning',
  'Patio/deck',
  'Pet visit allowed',
  'Birthday celebrations',
  'Holiday decor/celebration',
  'Pet therapy',
  'Craft sessions',
  'Story time',
  'Tea time',
  'Occasional Live music',
  'Care management tool (Syncwise)',
  'Pharmacy medication delivered',
];
export const defaultNotIncludedFeatureList = [
  <>
    <b>Clothing and Footwear:</b> Residents are typically responsible for their
    own clothing, shoes, and accessories.
  </>,
  <>
    <b>Personal Hygiene Products:</b> Toothpaste, toothbrush, soap, shampoo, and
    other personal care items.
  </>,
  <>
    <b>Hair Care Products:</b> Hair supplies, other hair care products.
  </>,
  <>
    <b>Cosmetics:</b> Makeup, perfume, and other cosmetics.
  </>,
  <>
    <b>Specialized Medical Equipment:</b> Wheelchairs, walkers, canes, oxygen
    tanks, and other medical equipment.
  </>,
  <>
    <b>Incontinence Supplies:</b> Adult diapers, briefs, and incontinence pads.
  </>,
  <>
    <b>Wound Care Supplies:</b> Dressings, bandages, and other wound care
    supplies.
  </>,
  <>
    <b>Specialized Diets:</b> Special foods or dietary supplements to
    accommodate specific dietary needs or medical conditions.
  </>,
  <>
    <b>Media Subscriptions:</b> Streaming services, cable TV, or anything
    personal.
  </>,
  <>
    <b>Hobbies and Crafts:</b> Supplies for hobbies and crafts, such as paints,
    brushes, yarn, etc.
  </>,
  <>
    <b>Books and Magazines:</b> Purchase of books, magazines, or newspapers,
    digital.
  </>,
  <>
    <b>Phone and Internet Services:</b> Personal phone and internet plans.
  </>,
  <>
    <b>Laundry and Dry Cleaning:</b> Services beyond basic housekeeping.
  </>,
  <>
    <b>Transportation:</b> Transportation costs for personal outings or medical
    appointments.
  </>,
];
