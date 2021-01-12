module Tracks
  class MissingRangesPresenter
    def self.call(*args)
      new(*args).call
    end

    def initialize(ranges, start_time, end_time)
      @ranges = ranges
      @start_time = start_time
      @end_time = end_time
    end

    def call
      return [] if start_time == end_time
      return [] unless ranges

      ranges
        .then { |ranges| remove_short_ranges(ranges) }
        .then { |ranges| rearrange_to_selected_range(ranges) }
        .compact
    end

    private

    attr_reader :ranges, :start_time, :end_time

    def remove_short_ranges(ranges)
      ranges.delete_if { |range| range['end'] - range['start'] <= 1.second }
    end

    def rearrange_to_selected_range(ranges)
      ranges.map do |range|
        range_intersects = selected_range.cover?(range['start']) ||
                           selected_range.cover?(range['end'])
        next unless range_intersects

        {
          start: [range['start'] - start_time, 0].max.round(1),
          end: [range['end'] - start_time, end_time].min.round(1)
        }
      end
    end

    def selected_range
      start_time..end_time
    end
  end
end
