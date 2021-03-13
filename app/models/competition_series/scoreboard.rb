class CompetitionSeries::Scoreboard
  include ActiveModel::Conversion

  attr_reader :series, :settings

  delegate :adjust_to_wind?, :split_by_categories?, to: :params

  def initialize(series, params)
    @series = series
    @settings = Settings.new(params)
  end

  def rounds_by_discipline = rounds.group_by(&:discipline)

  def categories
    @categories ||=
      Event::Section
      .where(event: series.competitions)
      .select(:name, 'avg("order") AS order')
      .order('avg("order")')
      .group(:name)
      .map { |record| build_category(record) }
  end

  def columns_count = rounds.count * 2 + rounds_by_discipline.count + 4

  private

  def rounds
    @rounds ||=
      Event::Round
      .select(:discipline, :number, 'min(created_at)')
      .distinct
      .where(event: series.competitions)
      .group(:discipline, :number)
      .order(:number, 'min(created_at)')
      .map { |record| build_round(record) }
  end

  def competitors
    @competitors ||=
      Event::Competitor
      .includes(:section, event: :place, suit: :manufacturer, profile: :country)
      .where(event: series.competitions)
  end

  def build_round(record)
    Round
      .new(record.discipline, record.number)
      .tap { |round| round.excluded! if settings.excluded_rounds.include? round.slug  }
  end

  def build_category(category)
    category_competitors =
      competitors.select { |competitor| competitor.section.name.casecmp? category.name }
    category_results =
      results.select { |result| category_competitors.include? result.competitor }

    standings = Standings.build(category_competitors, rounds, category_results)

    Category.new(category.name, standings)
  end

  def results
    @results ||=
      Event::Result
      .includes(:round, :competitor)
      .where(round: Event::Round.where(event: series.competitions))
  end
end