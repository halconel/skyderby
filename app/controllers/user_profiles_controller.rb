# encoding: utf-8
class UserProfilesController < ApplicationController
  before_action :set_profile, only: [:edit, :update]

  load_and_authorize_resource

  def index
    @profiles = UserProfile.order(:name)

    if params[:query] 
      @profiles = @profiles.joins(:user) if params[:query][:only_registered]
      @profiles = @profiles.search(params[:query][:term]) if params[:query][:term]
    end
  end
 
  def show
    @profile = UserProfile
                .includes(:badges)
                .includes(:tracks)
                .includes(tracks: :distance)
                .includes(tracks: :speed)
                .includes(tracks: :time)
                .includes(tracks: :wingsuit)
                .includes(tracks: {wingsuit: :manufacturer})
                .find(params[:id]) 
  end

  def edit
  end

  def update
    if @profile.update profile_params
      @profile
    else
      respond_to do |format|
        format.html { redirect_to edit_user_profile_path(@profile) }
        format.json { render json: @profile.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_profile
    @profile = UserProfile.find(params[:id])
  end

  def profile_params
    params.require(:user_profile).permit(:name, :userpic)
  end
end
