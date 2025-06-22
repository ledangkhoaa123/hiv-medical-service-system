import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectModel(BlogPost.name)
    private blogPostModel: SoftDeleteModel<BlogPostDocument>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto, user: IUser) {
    const created = new this.blogPostModel({
      ...createBlogPostDto,
      authorID: user._id,
      createdBy: {
        _id: new Types.ObjectId(user._id),
        email: user.email,
      },
    });
    return created.save();
  }

  async findAll() {
    return this.blogPostModel
      .find()
      .select('-isDeleted -deletedAt')
      .populate('authorID', 'email fullName')
      .exec();
  }

  async findOne(id: string, user: IUser) {
    return this.blogPostModel
      .findById(id)
      .select('-isDeleted -deletedAt')
      .populate('authorID', 'email fullName')
      .exec();
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto, user: IUser) {
    const updated = await this.blogPostModel
      .findByIdAndUpdate(id, updateBlogPostDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string, user: IUser) {
    const deleted = await this.blogPostModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return deleted;
  }
}
